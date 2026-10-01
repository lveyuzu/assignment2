import { useEffect, useRef } from "react";

function App() {
  const canvasRef=useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx=canvas.getContext("2d");

    canvas.width=900;
    canvas.height=500;

    const player = {
      x:100,
      y:300,
      width:64,
      height:64,

      speed : 5,
      velocityY:0,
      jumpPower : 12,
      gravity:0.5,

      onGround:false,

      frameWidth:128,
      frameHeight:300,
      frame:0,
      frameTimer:0
    };

    const image=new Image();
    image.src="/sprites/playersheet.png";

    const keys={};

    function keyDown(e){
      keys[e.key]=true;
    }

    function keyUp(e){
      keys[e.key]=false;
    }

    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);

    const platforms=[
      {
        x:0,
        y:430,
        width:900,
        height:70
      },
      {
        x:300,
        y:330,
        width:200,
        height:20
      },
      {
        x:650,
        y:250,
        width:150,
        height:20
      }
    ];

    function update(){

      if(keys["ArrowLeft"] || keys["a"]){
        player.x-=player.speed;
      }

      if(keys["ArrowRight"] || keys["d"]){
        player.x+=player.speed;
      }

      if(
        (keys["ArrowUp"] || keys["w"] || keys[" "]) &&
        player.onGround
      ){
        player.velocityY=-player.jumpPower;
        player.onGround=false;
      }

      player.velocityY+=player.gravity;
      player.y+=player.velocityY;

      player.onGround=false;

      for(let platform of platforms){

        if(
          player.x < platform.x+platform.width &&
          player.x+player.width > platform.x &&
          player.y+player.height >= platform.y &&
          player.y+player.height-player.velocityY <= platform.y
        ){
          player.y=platform.y-player.height;
          player.velocityY=0;
          player.onGround=true;
        }
      }

      if(player.x<0){
        player.x=0;
      }

      if(player.x+player.width>canvas.width){
        player.x=canvas.width-player.width;
      }

      let moving=
        keys["ArrowLeft"] ||
        keys["ArrowRight"] ||
        keys["a"] ||
        keys["d"];

      if(moving && player.onGround){

        player.frameTimer++;

        if(player.frameTimer>8){
          player.frameTimer=0;
          player.frame++;

          if(player.frame>=4){
            player.frame=0;
          }
        }

      }else{
        player.frame=0;
        player.frameTimer=0;
      }
    }

    function draw(){

      ctx.fillStyle="#87CEEB";
      ctx.fillRect(0,0,900,500);

      for(let platform of platforms){

        ctx.fillStyle="#654321";

        ctx.fillRect(
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );

        ctx.fillStyle="#4CAF50";

        ctx.fillRect(
          platform.x,
          platform.y,
          platform.width,
          8
        );
      }

      ctx.imageSmoothingEnabled=false;

      if(image.complete && image.naturalWidth>0){

        ctx.drawImage(
          image,
          player.frame*player.frameWidth,
          0,
          player.frameWidth,
          player.frameHeight,
          player.x,
          player.y,
          player.width,
          player.height
        );

      }else{

        ctx.fillStyle="red";

        ctx.fillRect(
          player.x,
          player.y,
          player.width,
          player.height
        );
      }
    }

    function gameLoop(){
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return()=>{
      window.removeEventListener("keydown",keyDown);
      window.removeEventListener("keyup",keyUp);
    };

  },[]);

  return(
    <div
      style={{
        width:"100vw",
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#222"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width:"900px",
          height:"500px",
          imageRendering:"pixelated"
        }}
      />
    </div>
  );
}

export default App;