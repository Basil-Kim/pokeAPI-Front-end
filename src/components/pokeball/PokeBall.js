import React from 'react';
import {background, chakra, css, keyframes } from '@chakra-ui/react';


const drop = keyframes`
  0% { top: -200px }
  60% { top: 0 }
  80% { top: -20px }
  100% { top: 0 }
`

const wiggle = keyframes`
  0% { transform: rotate(0); }
  10% { transform: rotate(30deg); }
  20% { transform: rotate(-30deg); }
  30% { transform: rotate(15deg); }
  40% { transform: rotate(-15deg); }
  50% { transform: rotate(0); }
  100% { transform: rotate(0); }
`
const blink = keyframes`
from { background: #eee;}
to { background: #e74c3c; }
`

const PokeBallIcon = chakra('div', {
  baseStyle: {
    position: "relative",
    width: "100px", 
    height:  "100px",
    background: "#fff",
    border: "0.15px solid #000",
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "inset -5px 5px 0 5px #ccc",
    animation: `${drop} 0.25s ease-in-out, ${wiggle} 1.25s cubic-bezier(0.36, 0.07, 0.19, 0.97) 3`,
    animationName: `${drop}, ${wiggle}`,
    "&:before": {
      content: `""`,
      position: "absolute",
      background: "teal.400",
      width: "100%",
      height: "50%"
    },
    "&:after": {
      top: "calc(50% - 10px)",
      width: "100%",
      height: "50%",
      background: "#000",
    },
  }
});

const PokeButton = chakra('div', {

baseStyle: {
  position: "absolute",
  top: "calc(50% - 30px)",
  left: "calc(50% - 30px)",
  width: "60px",
  height: "60px",
  background: "#7f8c8d",
  border: "10px solid #fff",
  borderRadius: "50%",
  zIndex: "10",
  boxShadow: "0 0 0 8px black",
  animation: `${blink} .5s alternate 7`,
  animationName: `${blink}`,
  transform: "scale(0.45)",
}

});


export default function PokeBall() {

  return (
   <PokeBallIcon>
    <PokeButton></PokeButton>
   </PokeBallIcon>
  )
}
