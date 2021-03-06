:- use_module(library(lists)).

% Get piece from board
%	      +      +      +      -
getPiece(Row, Column, Board, Piece):-
	nth1(Row, Board, R),
	nth1(Column, R, Piece).
getPiece([Row,Col], Board, Piece) :- getPiece(Row, Col, Board, Piece).

% Replace board cell (empty ou not) by a piece
%         +      +       +       +       -
setPiece(1, Column, Piece, [B|Bs], [ModRow|Bs]):-
	setPieceInRow(Column, Piece, B, ModRow), !.
setPiece(Row, Column, Piece, [B|Bs], [B|Rs]):-
	Row > 1,
	R1 is Row -1,
	setPiece(R1, Column, Piece, Bs, Rs).

setPieceInRow(1, Piece, [_|RowIn], [Piece|RowIn]):- !.
setPieceInRow(Col, Piece, [R|RowIn], [R|RowOut]):-
	Col > 1,
	C1 is Col -1,
	setPieceInRow(C1, Piece, RowIn, RowOut).

/******************************
** Verifies if move is valid.**
******************************/
moveValid(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn, 'yes') :-
	moveValidAux(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn), !.
moveValid(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn, 'no') :-
	\+ moveValidAux(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn), !.

moveValidAux(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn) :-
	getPiece(RowFrom, ColFrom, BoardIn, PieceFrom),
	PieceFrom = [Color, Legs, _], !,
	thereIsPath([RowFrom,ColFrom], [RowTo,ColTo], Legs, BoardIn).

/************************************************************************************
** Move a piece in board and capture, if possible, enemies. Update the players too.**
************************************************************************************/
moveAndCapture(Color, RowFrom, ColFrom, RowTo, ColTo, BoardIn, BoardOut, PlayerFromIn, PlayerFromOut, PlayerToIn, PlayerToOut) :-
	getPiece(RowFrom, ColFrom, BoardIn, PieceFrom),
	PieceFrom = [Color, Legs, _], !,
    thereIsPath([RowFrom,ColFrom], [RowTo,ColTo], Legs, BoardIn),
	getPiece(RowTo, ColTo, BoardIn, PieceTo),
	setPieceWithMorePincers(RowTo, ColTo, PieceFrom, PieceTo, BoardIn, BoardAux, PlayerFromIn, PlayerFromOutAux, PlayerToIn, PlayerToOutAux),
	setPiece(RowFrom, ColFrom, empty, BoardAux, BoardAux2),
    transformBoard(BoardAux2, BoardOut),
    transformPlayer(PlayerFromOutAux, PlayerFromOut),
    transformPlayer(PlayerToOutAux, PlayerToOut).

setPieceWithMorePincers(RowTo, ColTo, PieceFrom, PieceTo, BoardIn, BoardOut, PlayerFromIn, PlayerFromIn, PlayerToIn, PlayerToIn) :-
	PieceTo = empty,
	setPiece(RowTo, ColTo, PieceFrom, BoardIn, BoardOut).

setPieceWithMorePincers(RowTo, ColTo, PieceFrom, PieceTo, BoardIn, BoardOut, PlayerFromIn, PlayerFromOut, PlayerToIn, PlayerToOut) :-
	PieceTo \= empty,
	getPincersOfPiece(PieceFrom, PincersFrom), getPincersOfPiece(PieceTo, PincersTo),

	(PincersFrom > PincersTo, setPiece(RowTo, ColTo, PieceFrom, BoardIn, BoardOut),
	updateScoreOfPlayer(1, PlayerFromIn, PlayerFromInAux), updatePiecesOfPlayer(PieceTo, PlayerFromInAux, PlayerFromOut),
    PlayerToOut = PlayerToIn;

	PincersTo > PincersFrom, setPiece(RowTo, ColTo, PieceTo, BoardIn, BoardOut),
	updateScoreOfPlayer(1, PlayerToIn, PlayerToInAux), updatePiecesOfPlayer(PieceFrom, PlayerToInAux, PlayerToOut),
    PlayerFromOut = PlayerFromIn;

	PincersTo =:= PincersFrom, setPiece(RowTo, ColTo, empty, BoardIn, BoardOut),
	updateScoreOfPlayer(1, PlayerFromIn, PlayerFromInAux), updateScoreOfPlayer(1, PlayerToIn, PlayerToInAux),
	updatePiecesOfPlayer(PieceTo, PlayerFromInAux, PlayerFromOut), updatePiecesOfPlayer(PieceFrom, PlayerToInAux, PlayerToOut)).

transformBoard([], []).
transformBoard([Row|Rows], [RowOut|RowsOut]) :-
    transformBoardAux(Row, RowOut),
    transformBoard(Rows, RowsOut).

transformBoardAux([], []).
transformBoardAux([empty|T], [0|TOut]) :-
    transformBoardAux(T, TOut).
transformBoardAux([[w,L,P]|T], [[0,L,P]|TOut]) :-
    transformBoardAux(T, TOut).
transformBoardAux([[b,L,P]|T], [[1,L,P]|TOut]) :-
    transformBoardAux(T, TOut).

transformPlayer([w|T], [0|T]).
transformPlayer([b|T], [1|T]).

getPincersOfPiece([_, _, Pincers], Pincers).

getColorOfPiece([Color|_], Color).

updateScoreOfPlayer(PointsToSum, [Color, Adaptoids, Legs, Pincers, Score] ,[Color, Adaptoids, Legs, Pincers, NewScore]) :-
	NewScore is Score + PointsToSum.

updatePiecesOfPlayer([_, LegsToAdd, PincersToAdd], [Color, Adaptoids, Legs, Pincers, Score], [Color, NewAdaptoids, NewLegs, NewPincers, Score]) :-
	NewAdaptoids is Adaptoids + 1,
	NewLegs is Legs + LegsToAdd,
	NewPincers is Pincers + PincersToAdd.

takePiecesFromPlayer([NAdaptoids, NLegs, NPincers], [Color, Adaptoids, Legs, Pincers, Score], [Color, NewAdaptoids, NewLegs, NewPincers, Score]) :-
	NewAdaptoids is Adaptoids - NAdaptoids,
	NewLegs is Legs - NLegs,
	NewPincers is Pincers - NPincers,
	NewAdaptoids >= 0, NewLegs >= 0, NewPincers >= 0.

% If there is a path between 'NoInicio' and 'NoFim' with distance less or equal
% to 'DistMax', returns 'yes'.
% thereIsPath( + NoInicio, + NoFim, - Lista, + DistMax, + Board)
thereIsPath(NoInicio, NoFim, DistMax, Board) :-
	getPiece(NoInicio, Board, P1),
	P1 \= empty,
	getPiece(NoFim, Board, P2),
	(P2 = empty; \+ piecesHaveSameColor(P1,P2)),
	caminhoAux(NoInicio, NoFim, [NoInicio], _, DistMax, Board).

piecesHaveSameColor([Color1|_],[Color2|_]) :-
	Color1 = Color2.

caminhoAux(NoInicio, NoFim, Lista, ListaFim, N, Board) :-
	N >= 1,
	connected(NoInicio, NoFim, Board),
	append(Lista, [NoFim], ListaFim).
caminhoAux(NoInicio, NoFim, Lista, ListaFim, N, Board):-
	N > 1,
	connected(NoInicio, NoInterm, Board),
	NoInterm \= NoFim,
	getPiece(NoInterm, Board, Piece),
	Piece = empty,
	\+(member(NoInterm, Lista)),
	append(Lista, [NoInterm], Lista2),
	N2 is N - 1,
	caminhoAux(NoInterm, NoFim, Lista2, ListaFim, N2, Board).

connected([RowFrom, ColFrom], [RowTo, ColTo], Board) :-
	logicToCliCoords(RowFrom, ColFrom, RowFC, ColFC),
	generateEdges(RowFC, ColFC, RowTC, ColTC),
	cliToLogicCoords(RowTC, ColTC, RowAux, ColAux),
	RowTo is RowAux, ColTo is ColAux,
	validPosition(RowTo, ColTo, Board).

% logicToCliCoords(LogicRow, LogicCol, CliRow, CliCol)
logicToCliCoords(R, C, R, C) :- R =< 4.
logicToCliCoords(R, C, R, CliC) :-
	R > 4,
	CliC is C + R - 4.

% CliToLogicCoords(CliRow, CliCol, LogicRow, LogicCol)
cliToLogicCoords(R, C, R, C) :- R =< 4.
cliToLogicCoords(R, C, R, LogC) :-
	R > 4,
	LogC is C - (R - 4).

generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli - 1, ColToCli is ColFromCli - 1.
generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli - 1, ColToCli is ColFromCli.
generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli, ColToCli is ColFromCli - 1.
generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli, ColToCli is ColFromCli + 1.
generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli + 1, ColToCli is ColFromCli.
generateEdges(RowFromCli, ColFromCli, RowToCli, ColToCli) :-
	RowToCli is RowFromCli + 1, ColToCli is ColFromCli + 1.

validPosition(R, C, Board) :- getPiece(R, C, Board, _).

% Create basic adaptoid of give color
% createAdaptoid( + Color, + Row, + Column, + BoardIn, - BoardOut)
createAdaptoid(Color, PlayerIn, Row, Column, BoardIn, BoardOut, PlayerOut):-
    getPiece(Row,Column,BoardIn, Piece),
    Piece = empty,
	neighborValid(Row, Column, _, _, Color, BoardIn),
    PlayerIn = [Color|_],
	takePiecesFromPlayer([1, 0, 0], PlayerIn, PlayerInAux), !,
    setPiece(Row,Column,[Color,0,0],BoardIn,BoardInAux),
    transformPlayer(PlayerInAux, PlayerOut),
    transformBoard(BoardInAux, BoardOut).

neighborValid(Row, Col, NeighborRow, NeighborCol, Color, Board) :-
	connected([Row,Col], [NeighborRow, NeighborCol], Board),
	getPiece(NeighborRow, NeighborCol, Board, [Color|_]).

% Add pincer of given colour to a piece in board
%           +     +      +       +        -
addPincer(Color, PlayerIn, Row, Column, BoardIn, BoardOut, PlayerOut):-
   getPiece(Row,Column,BoardIn, Piece),
   Piece = [Color, Legs, Pincers], !,
   Total is Legs + Pincers + 1,
   Total =< 6,
   PlayerIn = [Color|_],
   takePiecesFromPlayer([0, 0, 1], PlayerIn, PlayerInAux), !,
   P1 is Pincers+1,
   P = [Color, Legs, P1],
   setPiece(Row, Column, P, BoardIn, BoardInAux),
   transformPlayer(PlayerInAux, PlayerOut),
   transformBoard(BoardInAux, BoardOut).


% Add leg of given colour to a piece in board
%        +     +      +       +        -
addLeg(Color, PlayerIn, Row, Column, BoardIn, BoardOut, PlayerOut):-
   getPiece(Row,Column,BoardIn, Piece),
   Piece = [Color, Legs, Pincers], !,
   Total is Legs + Pincers + 1,
   Total =< 6,
   PlayerIn = [Color|_],
   takePiecesFromPlayer([0, 1, 0],PlayerIn,PlayerInAux), !,
   L is Legs+1,
   P = [Color, L, Pincers],
   setPiece(Row, Column, P, BoardIn, BoardInAux),
   transformPlayer(PlayerInAux, PlayerOut),
   transformBoard(BoardInAux, BoardOut).

% Capture starving adaptoids of a given colour
% captureAdaptoids( + Color, + BoardIn, - BoardOut)
captureAdaptoids(Color, BoardIn, BoardOut, PlayerIn, PlayerOut) :-
	findall([R,C], getPiece(R,C,BoardIn,[Color|_]), Pieces),
    getColorOfEnemy(Color, ColorEnemy),
    PlayerIn = [ColorEnemy|_],
	tryCaptureAPiece(Pieces, BoardIn, BoardInAux, PlayerIn, PlayerInAux),
	transformPlayer(PlayerInAux, PlayerOut),
    transformBoard(BoardInAux, BoardOut).

tryCaptureAPiece([], Board, Board, PlayerIn, PlayerIn).
tryCaptureAPiece([[R,C]|Ps], BoardIn, BoardOut, PlayerIn, PlayerOut) :-
	findall([NR,NC], isFreeSpace(R,C,NR,NC,BoardIn), FreeSpacesList),
	length(FreeSpacesList, NumFreeSpaces),
	getNumExtremetiesOfAPiece(R,C,BoardIn,Extremeties),
	captureAdaptoid(R, C, Extremeties, NumFreeSpaces, BoardIn, BoardAux, PlayerIn, P1),
	tryCaptureAPiece(Ps, BoardAux, BoardOut, P1, PlayerOut).

captureAdaptoid(R, C, Extremeties, NumFreeSpaces, BoardIn, BoardOut, PlayerIn, PlayerOut) :-
	Extremeties > NumFreeSpaces,
	getPiece(R, C, BoardIn, Piece),
	updateScoreOfPlayer(1, PlayerIn, P1),
	updatePiecesOfPlayer(Piece, P1, PlayerOut),
	setPiece(R, C, empty, BoardIn, BoardOut).
captureAdaptoid(_, _, Extremeties, NumFreeSpaces, BoardIn, BoardIn, PlayerIn, PlayerIn) :-
	Extremeties =< NumFreeSpaces.

getNumExtremetiesOfAPiece(R,C,Board,Extremeties) :-
	getPiece(R,C,Board,[_,Legs,Pincers]),
	Extremeties is Legs + Pincers.

isFreeSpace(Row, Col, NeighborRow, NeighborCol, Board) :-
	connected([Row,Col], [NeighborRow, NeighborCol], Board),
	getPiece(NeighborRow, NeighborCol, Board, empty).

getColorOfEnemy(w, b).
getColorOfEnemy(b, w).
