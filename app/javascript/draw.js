document.addEventListener("turbo:load", () => {
  console.log("initialized")

  /* なんとなく入れる時計 */
  if (document.getElementById("clock")){
    setInterval(() => {
      document.getElementById("clock").innerHTML = new Date().toLocaleString();
    }, 1000);
  }

  /* キャンパス描画 */
  let isDrag = false;
  const drawColor ={
    r:0, g:0, b:0, a:1
  }


  const canvas = document.getElementById("draw_canvas");
  if(canvas){
    const colorList =[
      { color:"black", value:{r:0,g:0,b:0}},
      { color:"grey", value:{r:128,g:128,b:128}},
      { color:"white", value:{r:255,g:255,b:255}},
      { color:"red", value:{r:255,g:0,b:0}},
      { color:"orange", value:{r:255,g:128,b:0}},
      { color:"yellow", value:{r:255,g:255,b:0}},
      { color:"Yellow-Green", value:{r:128,g:255,b:0}},
      { color:"Green", value:{r:0,g:255,b:0}},
      { color:"Blue-Green", value:{r:0,g:255,b:128}},
      { color:"Cyan", value:{r:0,g:255,b:255}},
      { color:"Majolica-Blue", value:{r:0,g:128,b:255}},
      { color:"Blue", value:{r:0,g:0,b:255}},
      { color:"Purple", value:{r:128,g:0,b:255}},
      { color:"Magenta", value:{r:255,g:0,b:255}},
      { color:"Pale-Orange", value:{r:255,g:0,b:128}},
    ]

    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineWidth = 16;
      ctx.strokeStyle = drawColor;
      const prev ={ x:0, y:0 }; 
      const setColor = ()=>{ 
        ctx.strokeStyle = `rgb(${drawColor.r} ${drawColor.g} ${drawColor.b} / ${drawColor.a})`;
        console.log(drawColor,ctx.strokeStyle)
      }
      canvas.addEventListener('mousemove',(e)=>{
          draw(e.offsetX, e.offsetY);
      })
      canvas.addEventListener('mousedown',(e)=>{
        ctx.beginPath();
        isDrag = true;
        prev.x = e.offsetX;
        prev.y = e.offsetY;
      })
      document.addEventListener('mouseup',()=>{
        ctx.closePath();
        isDrag = false;
      })
      canvas.addEventListener('mouseleave', () => {
        isDrag = false;
        ctx.closePath();
      });
      canvas.addEventListener('touchmove',(e)=>{
        const cRect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - cRect.left;
        const y = touch.clientY - cRect.top;
        draw(x, y);
      })
      canvas.addEventListener('touchstart',(e)=>{
        ctx.beginPath();
        isDrag = true;
        const touch = e.touches[0];
        const cRect = canvas.getBoundingClientRect();
        prev.x = touch.clientX - cRect.left;
        prev.y = touch.clientY - cRect.top;
      })
      document.addEventListener('touchend',()=>{
        ctx.closePath();
        isDrag = false;
      })
      function draw(x, y) {
        if (!isDrag) { return; }
        ctx.moveTo(prev.x,prev.y)
        ctx.lineTo(x, y);
        ctx.stroke();
        prev.x = x;
        prev.y = y;
      }
      /* ペイント機能拡張 */
      const lw = document.getElementById("line_width");
      if(lw){
        lw.addEventListener(
          "input",  () => ctx.lineWidth = lw.value * 2
        );
      }
      const la = document.getElementById("line_alpha");
      if(la){
        la.addEventListener(
          "input", () => {
            drawColor.a = Math.round((la.value / 10)**2 * 100)/100;
            setColor();
          }
        );
      }
      const cc = document.getElementsByClassName("color_checkbox")[0];
      colorList.map(({color,value})=>{
        const cb = document.createElement("input");
        cb.type = "radio";
        cb.name = "color";
        if(color==="black")cb.style.outline = "5px solid black";  
        cb.className = "color-button"
        cb.value = value;
        cb.style.backgroundColor = `rgb(${value.r},${value.g},${value.b})`;

        cb.addEventListener("change",()=>{
          document.querySelectorAll(".color-button").forEach(elm => {
            elm.style.outline = "none";
          });
          cb.style.outline = "5px solid black";
          drawColor.r = value.r;
          drawColor.g = value.g;
          drawColor.b = value.b;
          setColor();
        })
        cc.appendChild(cb);
      })
      document.getElementById("clear_canvas").addEventListener(
        "click", () => ctx.clearRect(0, 0, canvas.width, canvas.height)
      );
  /* submit書換 */
      const submitForm = e =>{
        e.preventDefault();//初期イベントキャンセル
        const mform = document.getElementById("memo_form");
        const imgData = document.getElementsByClassName("memo_img")[0];
        imgData.value = canvas.toDataURL("image/png");//jpg>透過情報があってダメ

        mform.submit(); //送信
      }

      const memoform = document.getElementById("memo_form");
      memoform.addEventListener(
        "submit", submitForm, false
      );
      const imgValue = memoform.getElementsByClassName("memo_img")[0].value;
      if(imgValue){
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = imgValue;  
      }
    }
  }
});