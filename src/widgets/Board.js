import { Box } from '@material-ui/core'
import React, {useRef, useLayoutEffect} from 'react'

import useStyles from '../style';
import * as d3 from 'd3';
import { generateStones } from './Stones'

const draw = (div, config, handleGameChange) => {
    
    let s = config.size,
        p=config.padding,
        width = config.grid * (s + p),
        height = (config.grid + 5) * (s + p),
        col = d3.scaleOrdinal().range(config.colors);

    const board = d3.range(config.grid).map((r) => 
        d3.range(config.grid).map((c) => 
            ({
                x: c * (s + p), 
                y: r * (s + p), 
                free: true 
            })));

    let stones = generateStones(config.stones), 
        drawnStones = [], 
        stoneCodes = {},
        currentStoneNrs = [],
        currentStoneStartpost = {x:0, y:0},
        stonesLayed = 0, 
        movingStone = 0;

    const removeCell = (cell) => {
        cell.stone.transition().duration(500)
            .attr("x",s / 2).attr("y", s / 2)
            .attr("height", 0).attr("width",0).remove();
        cell['stone'] = null;
        cell.free = true;
    }

    const checkRowColFull = () => {
        let fullRow = [], fullColumn = [];
        for (let r = 0; r < config.grid; r++){
            let cRow = board[r].every(c=>!c.free);
            let cCol = board.map(b => b[r]).every(c=>!c.free);
            if (cRow) {
                fullRow.push(r);
            }
            if (cCol) {
                fullColumn.push(r);
            }
        }
        fullRow.forEach(row => {
            board[row].forEach(cell => {
                removeCell(cell)
            })
        })
        fullColumn.forEach(col => {
            board.forEach(row => {
                let cell = row[col]
                removeCell(cell);
            })
        })
        return (fullRow.length + fullColumn.length) * config.grid;
    }
        
    const snapToGrid = (x, y) => {
        let pos = {
            c: Math.max(0, Math.floor(x / (s + p))),
            r: Math.max(0, Math.floor(y / (s + p)))
        }
        if (pos.r >= config.grid) {
            pos.y = currentStoneStartpost.y; //height + s * 2
            pos.x = currentStoneStartpost.x; //(width - s) / 2
            pos.c = pos.r = null;
        } else {
            pos.y = Math.min(config.grid-1, pos.r) * (s + p)
            pos.x = Math.min(config.grid-1, pos.c) * (s + p)
        }
        return pos
    }

    const checkPositionFree = (pos, codes) => {
        let flag = true;
        codes.forEach(t => {
            if (pos.c===null || pos.r===null){
                flag = false
            } else if (t[0]+pos.c >= config.grid || t[0]+pos.c < 0 || t[1]+pos.r >= config.grid || t[1]+pos.r < 0){
                flag = false
            } else if (board[t[1]+pos.r][t[0]+pos.c].free===false){
                flag = false;
            }
        })
        return flag;
    }

    const setPosition = (pos, val, codes, stn) => {
        codes.forEach((t,i) => {
            board[t[1]+pos.r][t[0]+pos.c].free = val;
            board[t[1]+pos.r][t[0]+pos.c].stone = stn[i];
        });
    }

    const moveStone = (x, y, stn) => {
        stn.forEach(t => t.attr("transform","translate("+(x)+","+(y)+")"));
    }

    let drawnPiecePos = 0;
    const drawStonePieces  = (stn, color, index) => {
        let pieces = []
        let stoneWidth = d3.max(stn.map(s => s[0]));
        let stoneHeight = d3.max(stn.map(s => s[1]));
        let stonePosY = height - 4 * (s+p)
        let stonePosX = drawnPiecePos * (s + p);
        if (stonePosX > width - (stoneWidth+1) * (s + p)){
            // stonePosY = height - 2 * (s+p)
            stonePosX = width - (stoneWidth+1) * (s + p)
        }
        let gPieces = svg.append("g")
        stn.forEach((cell) => {
            let piece = gPieces.append("rect")
                .attr("class","stn")
                .attr("x", cell[0] * (s + p) )
                .attr("y", cell[1] * (s + p))
                .attr("width", s )
                .attr("height", s )
                .attr("rx", 1)
                .attr("ry", 1)
                .style("fill", col(color))
                .style("fill-opacity", 0.75)
                .style("stroke", "#000")
                .style("stroke-width", 1)
                .attr("pointer-events", "none")
                .attr("transform","translate("+(stonePosX + 2)+","+(stonePosY)+")")
                // .call(drag);
            pieces.push(piece)
        })
        gPieces.append('rect')
            .attr("class", "draghandler")
            .attr("stn", index)
            .attr("x", stonePosX)
            .attr("y", stonePosY)
            .attr("width", (stoneWidth + 1)  * (s + p))
            .attr("height", (stoneHeight + 1) * (s + p))
            .attr("fill-opacity", 0)
            .attr("stroke", "none")
            .call(drag);
        drawnPiecePos += stoneWidth + 2;
        return pieces;
    }
 
    const drawStone = () => {
        if (currentStoneNrs.length>0){ return }

        stones = generateStones(config.stones);
        drawnPiecePos = 0;
        for (let i = 0, I = stones.length; i < I; i++){
            const stn = stones.shift();
            stoneCodes[stonesLayed] = stn.stone;
            let pieces = drawStonePieces(stn.stone, stn.type, stonesLayed);
            drawnStones.push(pieces);
            currentStoneNrs.push(stonesLayed);
            stonesLayed++;
        }
    }

    function dragstarted(event, i , n) {
        movingStone = +d3.select(this).attr("stn");
        let pos = {x: event.x, y: event.y}
        let stn = drawnStones[movingStone];
        let offset = {x: svg.node().getBoundingClientRect().x, 
            y: svg.node().getBoundingClientRect().y};
        stn.forEach(s => {
            pos.x = Math.min(pos.x, s.node().getBoundingClientRect().x - offset.x)
            pos.y = Math.min(pos.y, s.node().getBoundingClientRect().y - offset.y) 
        });
        currentStoneStartpost = pos;
        if (currentStoneNrs.indexOf(movingStone) < 0){
            movingStone = null;
        }
    }
    
    function dragged(event) {
        if (movingStone===null){return;}
        let stn = drawnStones[movingStone]
        let stnCode = stoneCodes[movingStone]
        let pos = snapToGrid(event.x, event.y - (s * 2));
        moveStone(pos.x, pos.y, stn)
        let check  = checkPositionFree(pos, stnCode);
        stn.forEach(m => {
            m.style("fill-opacity", check===false ? 0.25 : 0.75)
        });
    }
    
    function dragended(event) {
        if (movingStone===null){return;}
        let stn = drawnStones[movingStone]
        let stnCode = stoneCodes[movingStone]
        let pos = snapToGrid(event.x, event.y - (s * 2));
        let check  = checkPositionFree(pos, stnCode);

        if (check===true){
            setPosition(pos, false, stnCode, stn)
            d3.select(this).remove();
            stn.forEach(s => s.style("stroke-width", 0))
            handleGameChange('points', stnCode.length);
            currentStoneNrs.splice(currentStoneNrs.indexOf(movingStone), 1);
            let points = checkRowColFull();
            setTimeout(()=>{handleGameChange('fullrow', points)}, 500);
            drawStone();
        } else {
            pos = snapToGrid(width, height);
            moveStone(pos.x, pos.y, stn);
            stn.forEach(m => {
                m.style("fill-opacity", 0.75)
            });
        }
    }
    
    const drag = d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);

    d3.select(div).selectAll('*').remove();

    const svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform","translate("+p+","+p+")");

    let row = svg.selectAll(".row")
        .data(board)
        .enter().append("g")
        .attr("class", "row");

    row.selectAll(".square")
        .data((d) => d)
        .enter().append("rect")
        .attr("class","board")
        .attr("x", (d) => d.x )
        .attr("y", (d) => d.y )
        .attr("width", s )
        .attr("height", s )
        .attr("rx", s/config.size)
        .attr("ry", s/config.size)
        .style("fill", "#fff")
        .style("stroke", "#a2a2a2");

    drawStone();
    
}

const Board = ({config, points, handleChange}) => {
    const classes = useStyles();
    const widgetRef = useRef(null);

    const handleGameChange = (key, value) => {
        handleChange(key, value);
    }

    useLayoutEffect(() => {
        if (points > 0){ return; }
        draw(widgetRef.current, config, handleGameChange);
    });

    return <Box className={classes.board} ref={widgetRef}></Box>

}

export default Board;