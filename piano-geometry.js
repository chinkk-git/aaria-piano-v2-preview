(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.PianoGeometry=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function measure(canvasRect,keyRects,devicePixelRatio=1){
    const width=Math.max(0,canvasRect.width),height=Math.max(0,canvasRect.height);
    const keys=new Map();
    for(const item of keyRects){
      const r=item.rect||item;
      const left=r.left-canvasRect.left,right=r.right-canvasRect.left;
      const top=r.top-canvasRect.top,bottom=r.bottom-canvasRect.top;
      keys.set(Number(item.pitch),Object.freeze({pitch:Number(item.pitch),left,right,top,bottom,width:right-left,height:bottom-top,center:(left+right)/2,isBlack:!!item.isBlack}));
    }
    const pitches=[...keys.keys()].sort((a,b)=>a-b);
    return Object.freeze({width,height,dpr:Math.max(1,Math.min(2,Number(devicePixelRatio)||1)),landingY:height,keys,low:pitches[0]??null,high:pitches[pitches.length-1]??null});
  }
  function projectLane(geometry,pitch,y,vanishX=geometry.width/2,horizonScale=.3){
    const key=geometry.keys.get(Number(pitch));
    if(!key||geometry.height<=0)return null;
    const depth=clamp(y/geometry.landingY,0,1);
    const center=vanishX+(key.center-vanishX)*depth;
    const scale=horizonScale+(1-horizonScale)*depth;
    const width=key.width*scale;
    return Object.freeze({pitch:key.pitch,isBlack:key.isBlack,depth,center,width,left:center-width/2,right:center+width/2,keyCenter:key.center,keyWidth:key.width});
  }
  function backingSize(geometry){return Object.freeze({width:Math.round(geometry.width*geometry.dpr),height:Math.round(geometry.height*geometry.dpr)});}
  return Object.freeze({measure,projectLane,backingSize});
});
