import { useEffect,useRef } from "react";
import playerSprite from "/sprites/playersheet.png";

function App(){

  const canvasRef=useRef(null);

  useEffect(()=>{

    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");

    canvas.width=900;
    canvas.height=500;

    // player
    const player={
      x:100,
      y:300,
      width:64,
      height:64,
      speed:5,
      jump:12,
      velocityY:0,
      gravity:0.6,
      onGround:false,
      frame:0,
      frameTimer:0
    };

    // player sprite
    const image=new Image();
    image.src=playerSprite;

    const keys={};

    // platforms for the level
    const platforms=[
      {x:0,y:430,width:400,height:70},
      {x:500,y:370,width:180,height:20},
      {x:750,y:300,width:180,height:20},
      {x:1000,y:380,width:180,height:20},
      {x:1250,y:320,width:180,height:20},
      {x:1500,y:250,width:180,height:20},
      {x:1750,y:350,width:180,height:20},
      {x:2000,y:280,width:180,height:20},
      {x:2250,y:220,width:180,height:20}
    ];

    let camera=0;
    let gameOver=false;
    let win=false;


    function keyDown(e){

      keys[e.key]=true;

      // press r to restart
      if(e.key==="r" && gameOver){
        restart();
      }

      if(e.key==="r" && win){
        restart();
      }
    }


    function keyUp(e){
      keys[e.key]=false;
    }

    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);


    function restart(){

      player.x=100;
      player.y=300;
      player.velocityY=0;
      player.frame=0;

      camera=0;
      gameOver=false;
      win=false;
    }


    function update(){

      if(gameOver || win){
        return;
      }

      // left and right
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
        player.velocityY=-player.jump;
        player.onGround=false;
      }


      // gravity
      player.velocityY+=player.gravity;
      player.y+=player.velocityY;

      player.onGround=false;


    
      for(let platform of platforms){

        if(
          player.x < platform.x+platform.width &&
          player.x+player.width > platform.x &&
          player.y+player.height > platform.y &&
          player.y+player.height-player.velocityY <= platform.y
        ){

          player.y=platform.y-player.height;
          player.velocityY=0;
          player.onGround=true;
        }
      }


      // falling off the map
      if(player.y>600){
        gameOver=true;
      }

      // end of level
      if(player.x>2150){
        win=true;
      }

      // dont go left forever
      if(player.x<0){
        player.x=0;
      }


      // walking animation
      if(
        keys["ArrowLeft"] ||
        keys["ArrowRight"] ||
        keys["a"] ||
        keys["d"]
      ){

        if(player.onGround){

          player.frameTimer++;

          if(player.frameTimer>8){

            player.frame++;
            player.frameTimer=0;

            if(player.frame>=4){
              player.frame=0;
            }
          }
        }

      }else{

        player.frame=0;
        player.frameTimer=0;
      }


      // camera
      camera=player.x-250;

      if(camera<0){
        camera=0;
      }
    }


    function draw(){

      // background sky
      ctx.fillStyle="#87CEEB";
      ctx.fillRect(0,0,900,500);

      // clouds
      ctx.fillStyle="#ffffff";

      for(let i=0;i<10;i++){

        ctx.fillRect(
          i*300-camera*0.2,
          100,
          100,
          20
        );
      }


      // platforms
      for(let platform of platforms){

        ctx.fillStyle="#654321";

        ctx.fillRect(
          platform.x-camera,
          platform.y,
          platform.width,
          platform.height
        );

        // green grass on top
        ctx.fillStyle="#4CAF50";

        ctx.fillRect(
          platform.x-camera,
          platform.y,
          platform.width,
          8
        );
      }


      // draw player
      if(image.complete){

        let frameWidth=image.naturalWidth/4;
        let frameHeight=image.naturalHeight;

        ctx.imageSmoothingEnabled=false;

        ctx.drawImage(
          image,
          player.frame*frameWidth,
          0,
          frameWidth,
          frameHeight,
          player.x-camera,
          player.y,
          player.width,
          player.height
        );
      }


      // game over
      if(gameOver){

        ctx.fillStyle="rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,900,500);

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="50px Arial";
        ctx.fillText("YOU DIED",450,220);

        ctx.font="20px Arial";
        ctx.fillText("PRESS R TO RESTART",450,270);
      }


      // won the game
      if(win){

        ctx.fillStyle="rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,900,500);

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="50px Arial";
        ctx.fillText("YOU WIN!",450,220);

        ctx.font="20px Arial";
        ctx.fillText("PRESS R TO RESTART",450,270);
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
