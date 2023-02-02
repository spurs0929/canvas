;(function(){
  // 切換棋手
  let user = true;
  // 判定該棋盤位置是否已有棋子
  let pos = new Map();
  // 顯示勝負
  let r = document.querySelector('.result');
  /**
   * 繪製棋盤
   * @param {*} width : 棋盤寬度
   * @param {*} height : 棋盤高度
   * @param {*} cs : 棋盤格尺寸
   * @param {*} ps : 棋子半徑
   */
  function drawPanel(width, height, cs, ps) {
    cs = cs || 16; // 棋盤格寬高
    ps = ps || 4; // 棋子半徑
    height = height || width; // 預設寬高一致 
    
    let el = document.querySelector('#canvas');
    el.setAttribute('width', width);
    el.setAttribute('height', height);
    // 產生2D畫布
    let context = el.getContext('2d');
    // 格子間距
    let split = ~~((width - 2 * ps) / cs);
    // 移動畫布到初始位置
    context.translate(ps, ps);
    // 開始繪製
    context.beginPath();
    context.strokeStyle = '#000';

    // 繪製棋盤
    for(let i = 0; i < split + 1; i++) {
      // column line
      context.moveTo(cs * i, 0);
      context.lineTo(cs * i, split * cs);
      context.stroke();
      // row line
      context.moveTo(0, cs * i);
      context.lineTo(split * cs, cs * i);
      context.stroke();
    }
    // 結束棋盤繪製
    context.closePath();
    
    // 下棋
    el.addEventListener('click', function(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      let rx = ~~((x - ps) / cs) + (((x - ps) % cs <= cs / 2) ? 0 : 1);
      let ry = ~~((y - ps) / cs) + (((y - ps) % cs <= cs / 2) ? 0 : 1); 
      
      // 防止棋子下在棋盤上已有棋子的位置
      if(!pos.has(`${rx},${ry}`)){
        // 儲存棋子位置
        pos.set(`${rx},${ry}`, user);
        // 繪製棋子
        drawPiece(context, cs, ps, user, rx, ry);
        // 判定勝負
        result(rx, ry);
        // 移除事件監聽
        user = !user;
      }
      
    }, false);

  }

  /**
   * 繪製棋子
   * @param {*} context 2D畫布
   * @param {*} cs 棋盤格尺寸
   * @param {*} ps 棋子半徑
   * @param {*} whiteOrBlack 白棋或黑棋
   * @param {*} rx 落子位置(x)
   * @param {*} ry 落子位置(y)
   */
  function drawPiece(context, cs, ps, whiteOrBlack, rx, ry) {
    if(whiteOrBlack === undefined) {
      throw Error('請輸入"white" or "black"');
    } 
    const WHITE_PIECE = '#fefefe';
    const BLACK_PIECE = '#000';

    switch(whiteOrBlack) {
      case true:
        // 繪製黑棋
        console.log(rx, ry, 'b')
        context.beginPath();
        context.arc(cs * rx, cs * ry, ps, 2 * Math.PI, false);
        context.fillStyle = BLACK_PIECE;
        context.strokeStyle = BLACK_PIECE;
        context.fill();
        context.stroke();
        context.closePath();
        break;
      case false:
        // 繪製白棋
        console.log(rx, ry, 'w')
        context.beginPath()
        context.arc(cs * rx, cs * ry, ps, 2 * Math.PI, false);
        context.fillStyle = WHITE_PIECE;
        context.strokeStyle = BLACK_PIECE;
        context.fill()
        context.stroke();
        context.closePath();
        break;
      default:
        break;  
    }
  }

  /**
   * 判定勝負
   * @param {*} rx 
   * @param {*} ry 
   */
  function result(rx, ry) {
    // 四個方向判斷有無獲勝
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    // 獲勝條件
    const winNumber = 5;
    // 
    let _pos = pos.get(`${rx},${ry}`);

    // 判斷遊戲是否結束
    for(let i = 0; i < directions.length; i++) {
      let num = 1;
      let dir = directions[i];
      
      for(let j = 1; j <= 4; j++) {
        if(pos.get(`${rx + dir[0] * j},${ry + dir[1] * j}`) === _pos) {
          num++;  
        } else {
          for(let j = -1; j >= -4; j--) {
            if(pos.get(`${rx + dir[0] * j},${ry + dir[1] * j}`) === _pos) {
              num++;
            }
          }
          break;
        }
      }
      if(num == winNumber) {
        r.innerHTML = user === true ? '黑棋勝' : '白棋勝';
        break;  
      }
    }
  }

  // 初始化函式
  function init() {
    // 繪製棋盤
    drawPanel(600, 600, 30, 12);
  }

  init();
})();