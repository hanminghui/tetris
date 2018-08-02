
//grid界面的长宽
var gridHeight = 25;
var gridWidth = 20;

//形状的颜色和形态
var color;
var shape;
//形状起始位置
var headH;
var headW;
//形状长宽
var sizeH;
var sizeW;
//下一个形状的颜色和形态
window.next = {
    nextShape: null,
    nextColor: null,
};

// 当前下落的形状
var tetri = new Array();
for (var i = 0; i < 4; i++) {
    tetri[i] = new Array(i);
    for (var j = 0; j < 4; j++) {
        tetri[i][j] = 0;
    }
}
// 下一个形状
var tetriNext = new Array();
for (var i = 0; i < 4; i++) {
    tetriNext[i] = new Array(i);
    for (var j = 0; j < 4; j++) {
        tetriNext[i][j] = 0;
    }
}

// grid数组，用来存储游戏界面
// 0为空白，数字对应不同的颜色
var grid = new Array();
for (var i = 0; i < gridHeight; i++) {
    grid[i] = new Array(i);
    for (var j = 0; j < gridWidth; j++) {
        grid[i][j] = 0;
        //cc.log(i + " , " + j);    //测试循环
    }
}

//测试改变颜色
//grid[3][4] = 1;
//grid[10][10] = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        levelDisplay: {
            default: null,
            type: cc.Label
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        block0: {
            default: null,
            type: cc.SpriteFrame
        },
        block1: {
            default: null,
            type: cc.SpriteFrame
        },
        block2: {
            default: null,
            type: cc.SpriteFrame
        },
        block3: {
            default: null,
            type: cc.SpriteFrame
        },
        block4: {
            default: null,
            type: cc.SpriteFrame
        },
        block5: {
            default: null,
            type: cc.SpriteFrame
        },
        block6: {
            default: null,
            type: cc.SpriteFrame
        },
        block7: {
            default: null,
            type: cc.SpriteFrame
        },
        // 这些属性引用了block预制资源：
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        buttonLeft: {
            default: null,
            type: cc.Button
        },
        buttonRight: {
            default: null,
            type: cc.Button
        },
        buttonRotate: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {

    	this.score = 0;
    	this.level = 1;
        this.generateGrid();
        shape = this.random();
        color = this.random();
        this.setNextTetri();
        this.generateTetri(shape,color);
        this.score++;
        this.updateScore();

        this.buttonLeft.node.on('click', this.moveLeft, this);
        this.buttonRight.node.on('click', this.moveRight, this);
        this.buttonRotate.node.on('click', this.rotate, this);
    },

    start () {

    },

    update (dt) {
    	this.updateGrid();
        this.remove();
        this.updateLevel();
    	if(!cc.isValid(this.node)) return;
    	var newTime = new Date().getTime();
    	if(!this.lastTickTime)this.lastTickTime = newTime;
    	if(this.time == parseInt((newTime - this.lastTickTime)/(1000/this.level))) return;
    	this.time = parseInt((newTime - this.lastTickTime)/(1000/this.level));
    	cc.log(this.time);
    	if(this.testBottom() == true) {
			this.gameover();
            shape = next.nextShape;
            color = next.nextColor;
            this.generateTetri(shape, color);
            this.score++;
    		this.updateScore();
            this.setNextTetri();
        }
        this.moveDown();

    },

    generateGrid: function () {
        
        for (var i = 0; i < gridHeight; i++)
        {
            for(var j = 0; j < gridWidth; j++)
            {
                // 使用给定prefab生成一个新节点
                var newBlock = cc.instantiate(this.blockPrefab);
                // 将新节点添加到当前节点（grid）下
                this.node.addChild(newBlock);
                // 设置新结点位置
                newBlock.setPosition(cc.p(j*50, i*50));
                newBlock.name = "row" + i + "col" + j;
                //cc.log(newBlock.name);
                //newBlock.getComponent(cc.Sprite).spriteFrame = this.block7;
            }
        }   
    },

    //依据数组grid刷新界面
    updateGrid: function () {

        for (var i = 0; i < gridHeight; i++)
        {
            for(var j = 0; j < gridWidth; j++)
            {
                var block = this.node.getChildByName("row" + i + "col" + j);
                switch(grid[i][j])
                {
                    // 依据grid数组中的值来确定显示与否和不同颜色
                    case 0: block.getComponent(cc.Sprite).spriteFrame = this.block0;    break;
                    case 1: block.getComponent(cc.Sprite).spriteFrame = this.block1;    break;
                    case 2: block.getComponent(cc.Sprite).spriteFrame = this.block2;    break;
                    case 3: block.getComponent(cc.Sprite).spriteFrame = this.block3;    break;
                    case 4: block.getComponent(cc.Sprite).spriteFrame = this.block4;    break;
                    case 5: block.getComponent(cc.Sprite).spriteFrame = this.block5;    break;
                    case 6: block.getComponent(cc.Sprite).spriteFrame = this.block6;    break;
                    case 7: block.getComponent(cc.Sprite).spriteFrame = this.block7;    break;
                }
            }
        }   
    },

    //生成7种不同的tetri，参数为1~7
    generateTetri:function (shapeIndex, colorIndex) {

        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                tetri[i][j] = 0;
            }
        }

        switch(shapeIndex)
        {
            // 7种不同形状的tetri
            // 
            //  ####
            //
            case 1: sizeH = 1; sizeW = 4; tetri[0][0] = 1; tetri[0][1] = 1; tetri[0][2] = 1; tetri[0][3] = 1; break;
            //  #
            //  ###
            //
            case 2: sizeH = 2; sizeW = 3; tetri[0][0] = 1; tetri[1][0] = 1; tetri[1][1] = 1; tetri[1][2] = 1; break;
            // 
            //    #
            //  ###
            case 3: sizeH = 2; sizeW = 3; tetri[0][2] = 1; tetri[1][0] = 1; tetri[1][1] = 1; tetri[1][2] = 1; break;
            // 
            //   ##
            //  ##
            case 4: sizeH = 2; sizeW = 3; tetri[0][1] = 1; tetri[0][2] = 1; tetri[1][0] = 1; tetri[1][1] = 1; break;
            // 
            //  ##
            //   ##
            case 5: sizeH = 2; sizeW = 3; tetri[0][0] = 1; tetri[0][1] = 1; tetri[1][1] = 1; tetri[1][2] = 1; break;
            // 
            //  ##
            //  ##
            case 6: sizeH = 2; sizeW = 2; tetri[0][0] = 1; tetri[0][1] = 1; tetri[1][0] = 1; tetri[1][1] = 1; break;
            // 
            //   #
            //  ###
            case 7: sizeH = 2; sizeW = 3; tetri[0][1] = 1; tetri[1][0] = 1; tetri[1][1] = 1; tetri[1][2] = 1; break;
        }

        headW = 9;
        headH = 24;

        for(var i = 0; i < sizeH; i++) {
            for(var j = 0; j < sizeW; j++)
                if(tetri[i][j] == 1) {
                    grid[headH-i][headW+j] = colorIndex;
                }
        }
    },

    setNextTetri: function () {
        next.nextColor = this.random();
        //cc.log("nextColor: " + nextColor);
        next.nextShape = this.random();
        //cc.log("nextShape: " + nextColor);
    },

    //tetri向下移动一格
    moveDown: function () {
        if(this.testBottom() == false) {
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = 0;
                    }
                }
            }
            headH--;
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = color;
                    }
                }
            }
            //cc.log("moveDown");
        }
    },

    //左移
    moveLeft: function () {
        if(this.testEdgeL() == false) {
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = 0;
                    }
                }
            }
            headW--;
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = color;
                    }
                }
            }
        }
    },

    //右移
    moveRight: function () {
        if(this.testEdgeR() == false) {
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = 0;
                    }
                }
            }
            headW++;
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = color;
                    }
                }
            }
        }
    },

    //旋转
    rotate: function () {
        //存储原始tetri
        var originTetri = new Array();
        for (var i = 0; i < 4; i++) {
            originTetri[i] = new Array(i);
            for (var j = 0; j < 4; j++) {
                originTetri[i][j] = 0;
            }
        }
        //cc.log("generate originTetri: done");

        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                originTetri[i][j] = tetri[i][j];
            }
        }
        //cc.log("copy to originTetri: done");

        //临时tetri，存放中间结果
        var tempTetri = new Array();
        for (var i = 0; i < 4; i++) {
            tempTetri[i] = new Array(i);
            for (var j = 0; j < 4; j++) {
                tempTetri[i][j] = 0;
            }
        }
        //cc.log("generate tempTetri: done");
        //先转置
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                tempTetri[i][j] = tetri[j][i];
            }
        }
        //cc.log("copy to tempTetri, stage 1 : done");
        var temp = sizeH;
        sizeH = sizeW;
        sizeW = temp;
        for(var i = 0; i < sizeH; i++) {
            for(var j = 0; j < sizeW; j++) {
                tetri[i][sizeW-1-j] = tempTetri[i][j];
            }
        }
        //cc.log("copy to tempTetri, stage 2 : done");

        if(this.testCollision() == false) {
            for(var i = 0; i < 4; i++) {
                for(var j = 0; j < 4; j++) {
                    if(originTetri[i][j] == 1) {
                        grid[headH-i][headW+j] = 0;
                    }
                }
            }
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = color;
                    }
                }
            }
        } else {    //冲突，不能旋转
        temp = sizeH;
        sizeH = sizeW;
        sizeW = temp;
            for(var i = 0; i < sizeH; i++) {
                for(var j = 0; j < sizeW; j++) {
                    tetri[i][j] = originTetri[i][j];
                }
            }
        }
    },

    //判断是否无法再向下移动
    testBottom: function () {
        for(var j = 0; j < sizeW; j++) {
            var bottom = 1;
            for(var i = sizeH - 1; i >=0; i--) {
                if(tetri[i][j] == 1 && bottom == 1) {
                    //超出底部，不能再下移
                    if (headH - i < 1) {
                        return true;
                    }
                    //下部有堆积的方块，不能再下移
                    if (grid[headH-i-1][headW+j] != 0) {
                        return true;
                    }
                    bottom--;
                }
            }
        }
        return false;
    },

    //判断左右边界及左右是否会覆盖
    testEdgeL: function () {
        if(headW < 1)
            return true;
        for(var i = 0; i < sizeH; i++) {
            var left = 1;
            for(var j = 0; j < sizeW; j++) {
                if(tetri[i][j] == 1 && left == 1) {
                    //左侧有堆积的方块，不能再左移
                    if (grid[headH-i][headW+j-1] != 0) {
                        return true;
                    }
                    left--;
                }
            }
        }
        return false;
    },
    testEdgeR: function () {
        if(headW + sizeW > 19)
            return true;
        for(var i = 0; i < sizeH; i++) {
            var right = 1;
            for(var j = sizeW-1; j >= 0; j--) {
                if(tetri[i][j] == 1 && right == 1) {
                    //右侧有堆积的方块，不能再右移
                    if (grid[headH-i][headW+j+1] != 0) {
                        return true;
                    }
                    right--;
                }
            }
        }
        return false;
    },

    //判断旋转时是否冲突
    testCollision: function () {
        var y = sizeH;
        var x = sizeW;
        for(var i = 0; i < sizeH; i++) {
            for(var j = 0; j < sizeW; j++) {
                if(tetri[i][j] == 1) {
                    if (headW + j > gridWidth - 1 || headW - i < 0)
                        return true;
                }
            }
        }
        return false;
    },

    //返回1~7的随机整数
    random: function () {
        return Math.ceil(Math.random()*7);
    },

    //检查一行是否已满
    testFull: function (line) {
        var full = 0;
        for(var j = 0; j < gridWidth; j++) {
            if (grid[line][j] != 0)
                full++;
        }
        if(full == 20) {
            cc.log("line " + line + " is full!");
            return true;
        }
        return false;
    },

    //已满的行消除
    remove: function () {
        var lines = 0;
        for(var i = 0; i < gridHeight; i++) {
            if(this.testFull(i) == true) {  //该行已满
                lines++;
                this.score += 10;
                for(var j = 0; j < gridWidth; j++) {
                    grid[i][j] = 0;
                }
                cc.log("消除一行, score = " + this.score.toString());
                this.updateScore();
                this.gridDown(i);
            }
        }
    },
    //grid从line往上部分下移一行
    gridDown: function (line) {
        for(var i = line; i < gridHeight-1 ; i++) {
            for (var j = 0; j < gridWidth; j++)
                grid[i][j] = grid[i+1][j];
        }
    },

    updateScore: function () {
        this.scoreDisplay.string = this.score.toString();
    },
    updateLevel: function () {
    	this.level = parseInt(this.score / 50) + 1;
    	this.levelDisplay.string = this.level.toString();
    },

	//检查一行是否为空
    testEmpty: function (line) {
        var full = 0;
        for(var j = 0; j < gridWidth; j++) {
            if (grid[line][j] != 0)
                full++;
        }
        if(full > 0) {
            cc.log("line " + line + " is full!");
            return false;
        }
        return true;
    },

    gameover: function () {
    	var nonEmptyLine = 0;
    	for(var i = 0; i < gridHeight; i++) {
            if(this.testEmpty(i) == false) {
            	nonEmptyLine++;
            }
        }
        if(nonEmptyLine == 25){
        	this.reload();
        }
    },

    reload: function () {
    	for(var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++)
                grid[i][j] = 0;
        }
        this.score = 0;
        this.level = 0;
    },
});
