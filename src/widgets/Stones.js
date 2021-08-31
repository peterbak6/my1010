import * as d3 from 'd3';

export const Stones = [
    {stone:[[0,0]], weight: 4, type:0},

    {stone:[[0,0],[0,1]], weight: 3, type:1}, 
    {stone:[[0,0],[1,0]], weight: 3, type:1},

    {stone:[[0,0],[0,1],[0,2]], weight: 2, type:2},
    {stone:[[0,0],[1,0],[2,0]], weight: 2, type:2},
    {stone:[[0,0],[1,0],[1,1]], weight: 2, type:0},
    {stone:[[0,0],[1,0],[0,1]], weight: 2, type:3},
    {stone:[[0,0],[0,1],[1,1]], weight: 2, type:3},
    {stone:[[1,0],[1,1],[0,1]], weight: 2, type:3},

    {stone:[[0,0],[0,1],[0,2],[0,3]], weight: 1, type:4},
    {stone:[[0,0],[1,0],[2,0],[3,0]], weight: 1, type:4},
    {stone:[[0,0],[0,1],[1,0],[1,1]], weight: 1, type:4},
    {stone:[[0,0],[0,1],[0,2],[1,2]], weight: 1, type:5},
    {stone:[[1,0],[1,1],[1,2],[0,2]], weight: 1, type:5},
    {stone:[[0,0],[1,0],[0,1],[2,0]], weight: 1, type:5},
    {stone:[[0,0],[1,0],[2,0],[2,1]], weight: 1, type:5},
    
    {stone:[[1,0],[1,1],[1,2],[0,1]], weight: 1, type:6},
    {stone:[[0,0],[0,1],[0,2],[1,1]], weight: 1, type:6},
    {stone:[[1,0],[0,1],[1,1],[2,1]], weight: 1, type:6},
    {stone:[[0,0],[1,0],[2,0],[1,1]], weight: 1, type:6},

    {stone:[[0,1],[1,0],[1,1],[2,0]], weight: 1, type:7},
    {stone:[[0,0],[1,0],[1,1],[2,1]], weight: 1, type:7},

    {stone:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]], weight: 1, type:0}
]

const weightedSample = (arr, wgh) => {
    let w = wgh.reduce((a, e) => a + e);
    let r = Math.random() * w;
    return arr.find((e, i) => (r -= wgh[i]) < 0);
}

export const generateStones = (N = 3) => {
    let stn = d3.range(N).map(() => {
        return weightedSample(d3.range(Stones.length), Stones.map(a=>a.weight))
    })
    return stn.map(s => Stones[s])
}