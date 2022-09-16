import React, {useEffect, useState} from 'react';
import './App.css';
import MyComponent from "./MyComponent"
import {Chessboard} from "react-chessboard";

type Square = {
    "containsPiece": boolean,
    "ycoord": number,
    "xcoord": number,
    "black": boolean,
    "king": boolean
}



function App() {

   const [winnerState, setWinner] = useState<string>("")

    const [playerColour, setPlayerColour] = useState<string>("")

    const start = () => {
        fetch("http://localhost:8080/start").then(response => {
            response.json().then(json => {
                if (json.player === 1) {
                    setPlayerColour("black")
                }
                else {
                    setPlayerColour("red")
                }
            })
        })
    }
    useEffect(start, []);

    const getFENString = (pieces: Square[]): string => {
        let fen = ""
        let y: number = 0
        let empty = 0;
        pieces.forEach(square => {
            if (empty > 0 && square.containsPiece) {
                fen += empty;
                empty = 0;
            }
            if (square.ycoord !== y) {
                y = square.ycoord;
                fen += empty > 0 ? empty : "";
                empty = 0;
                fen += "/";
            }
            if (square.containsPiece) {
                if (square.black) {
                    fen += square.king ? "k" : "p";
                } else {
                    fen += square.king ? "K" : "P";
                }
            } else {
                empty++;
            }
        });
        fen += empty > 0 ? empty : "";
        console.log("FEN " + fen);
        return fen;
    }

    const [boardState, setBoardState] = useState<string>("1p1p1p1p/p1p1p1p1/1p1p1p1p/8/8/P1P1P1P1/1P1P1P1P/P1P1P1P1");

    const refresh = () => {
        fetch("http://localhost:8080/board", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                response.json()
                    .then(body => {
                        console.log(body);
                        setBoardState(getFENString(body.board));
                    });
            });
    }

    useEffect(refresh, []);

    useEffect(() => {
        const refreshId = setInterval(refresh, 1000);
        return function cleanup() {
            clearInterval(refreshId)
        }
    }
    , [])


    return (
        <div className="container">
            <div className="chessboard">
               <div className="team-name">{playerColour}</div>
                <Chessboard
                    customDarkSquareStyle={{ backgroundColor: '#000000' }}
                    customLightSquareStyle={{ backgroundColor: '#212121' }}
                    //customPieces={{wP:({

                       // })}}
                    boardWidth={470}
                    customBoardStyle={{
                        borderRadius: '5px',
                        boxShadow: '0 0 1.3rem #bc13fe',
                    }}
                    showBoardNotation={false}
                    arePiecesDraggable
                    position={boardState}
                    customPieces={{
                        wP:() => <div className="red-piece"></div>,
                        bP:() => <div className="black-piece"></div>,
                        wK:() => <div className="red-king"></div>,
                        bK:() => <div className="black-king"></div>
                        }}
                    onPieceDrop={(sourceSquare, targetSquare, piece) => {

                        const startCoord = sourceSquare.split('');
                        //console.log(startCoord[0]);
                        //console.log(startCoord[1]);
                        const xMapperStart = {
                            a: 0,
                            b: 1,
                            c: 2,
                            d: 3,
                            e: 4,
                            f: 5,
                            g: 6,
                            h: 7
                        }
                        const xCoord: { [index: number]: any } = startCoord[0]
                        // @ts-ignore
                        const xNumberValueStart: number = xMapperStart[xCoord];
                        const yNumberValueStart = 8 - Number(startCoord[1]);
                        //console.log(xNumberValueStart);
                        //console.log(yNumberValueStart);
                        console.log(xNumberValueStart, yNumberValueStart);


                        const endCoord = targetSquare.split('');
                        //console.log(endCoord[0]);
                        //console.log(endCoord[1]);
                        const xMapperEnd = {
                            a: 0,
                            b: 1,
                            c: 2,
                            d: 3,
                            e: 4,
                            f: 5,
                            g: 6,
                            h: 7
                        }
                        const yCoord: { [index: number]: any } = endCoord[0]
                        // @ts-ignore
                        const xNumberValueEnd: number = xMapperEnd[yCoord];
                        const yNumberValueEnd = 8 - Number(endCoord[1]);
                        //console.log(xNumberValueEnd);
                        //console.log(yNumberValueEnd);
                        console.log(xNumberValueEnd, yNumberValueEnd)

                        fetch("http://localhost:8080/move", {
                            headers: {
                                'Content-Type': 'application/json',
                                Origin: "http://localhost:3000/"
                            },
                            method: "POST",
                            body: JSON.stringify({
                                posFrom: {x: xNumberValueStart, y: yNumberValueStart},
                                posTo: {x: xNumberValueEnd, y: yNumberValueEnd},
                                playerColour
                            })
                        })
                            .then(response => {

                            });

                        return true;
                    }}
                />
                <button onClick={() => {
                    setBoardState("loading...");
                    refresh();
                }}>REFRESH
                </button>


            </div>
        </div>
    );
}

export default App;
