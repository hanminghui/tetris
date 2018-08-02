
var gridHeight = 6;
var gridWidth = 6;

var headH;
var headW;

var sizeH;
var sizeW;

var shape;
var color;

// 下一个形状
var tetri = new Array();
for (var i = 0; i < 4; i++) {
    tetri[i] = new Array(i);
    for (var j = 0; j < 4; j++) {
        tetri[i][j] = 0;
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


cc.Class({
    extends: cc.Component,

    properties: {
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
    },

    onLoad: function () {
        this.generateGrid();
        this.generateTetri(next.nextShape, next.nextColor);
    },

    start () {

    },

    update (dt) {
        this.updateGrid();
        this.updateTetri();
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
                newBlock.name = "r" + i + "c" + j;
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
                var block = this.node.getChildByName("r" + i + "c" + j);
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

        headW = 1;
        headH = 2;

        // for(var i = 0; i < sizeH; i++) {
        //     for(var j = 0; j < sizeW; j++)
        //         if(tetri[i][j] == 1) {
        //             grid[headH-i][headW+j] = colorIndex;
        //         }
        // }
    },

    updateTetri: function () {
        if(shape != next.nextShape && color != next.nextColor) {
            shape = next.nextShape;
            color = next.nextColor;

            for(var i = 0; i < gridHeight; i++)
                for(var j = 0; j < gridWidth; j++)
                    grid[i][j] = 0;

            this.generateTetri(shape, color);

            for(var i = 0; i < gridHeight; i++) {
                for(var j = 0; j < gridWidth; j++)
                    if(tetri[i][j] == 1) {
                        grid[headH-i][headW+j] = color;
                    }
            }
        }
    },
});
