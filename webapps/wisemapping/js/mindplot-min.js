var mindplot={};
mindplot.util={};
mindplot.commands={};
mindplot.layout={};
mindplot.layout.boards={};
mindplot.layout.boards.original={};
mindplot.widget={};
mindplot.model={};
mindplot.collaboration={};
mindplot.collaboration.framework={};
mindplot.persistence={};
mindplot.layout={};
Class.Mutators.Static=function(a){this.extend(a)
};mindplot.Events=new Class({$events:{},_removeOn:function(a){return a.replace(/^on([A-Z])/,function(b,c){return c.toLowerCase()
})
},addEvent:function(c,b,a){c=this._removeOn(c);
this.$events[c]=(this.$events[c]||[]).include(b);
if(a){b.internal=true
}return this
},fireEvent:function(d,b,a){d=this._removeOn(d);
var c=this.$events[d];
if(!c){return this
}b=Array.from(b);
_.each(c,function(e){if(a){e.delay(a,this,b)
}else{e.apply(this,b)
}},this);
return this
},removeEvent:function(d,c){d=this._removeOn(d);
var b=this.$events[d];
if(b&&!c.internal){var a=b.indexOf(c);
if(a!=-1){b.splice(a,1)
}}return this
}});Options=new Class({setOptions:function(){var a=this.options=Object.merge.apply(null,[{},this.options].append(arguments));
if(this.addEvent){for(var b in a){if(typeOf(a[b])!="function"||!(/^on[A-Z]/).test(b)){continue
}this.addEvent(b,a[b]);
delete a[b]
}}return this
}});var web2d={};
web2d.peer={svg:{}};
web2d.peer.utils={};web2d.peer.utils.EventUtils={broadcastChangeEvent:function(elementPeer,type){var listeners=elementPeer.getChangeEventListeners(type);
if($defined(listeners)){for(var i=0;
i<listeners.length;
i++){var listener=listeners[i];
listener.call(elementPeer,null)
}}var children=elementPeer.getChildren();
for(var j=0;
j<children.length;
j++){var child=children[j];
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,type)
}}};web2d.peer.utils.TransformUtil={workoutScale:function(elementPeer){var current=elementPeer.getParent();
var width=1;
var height=1;
while(current){var coordSize=current.getCoordSize();
var size=current.getSize();
width=width*(parseInt(size.width)/coordSize.width);
height=height*(parseInt(size.height)/coordSize.height);
current=current.getParent()
}return{width:width,height:height}
}};web2d.peer.svg.ElementPeer=new Class({initialize:function(svgElement){this._native=svgElement;
if(!this._native.addEvent){for(var key in Element){this._native[key]=Element.prototype[key]
}}this._size={width:1,height:1};
this._changeListeners={}
},setChildren:function(children){this._children=children
},getChildren:function(){var result=this._children;
if(!$defined(result)){result=[];
this._children=result
}return result
},getParent:function(){return this._parent
},setParent:function(parent){this._parent=parent
},append:function(elementPeer){elementPeer.setParent(this);
var children=this.getChildren();
children.include(elementPeer);
this._native.appendChild(elementPeer._native);
web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
},removeChild:function(elementPeer){elementPeer.setParent(null);
var children=this.getChildren();
var oldLength=children.length;
children.erase(elementPeer);
$assert(children.length<oldLength,"element could not be removed:"+elementPeer);
this._native.removeChild(elementPeer._native)
},addEvent:function(type,listener){$(this._native).bind(type,listener)
},trigger:function(type,event){$(this._native).trigger(type,event)
},cloneEvents:function(from){this._native.cloneEvents(from)
},removeEvent:function(type,listener){$(this._native).unbind(type,listener)
},setSize:function(width,height){if($defined(width)&&this._size.width!=parseInt(width)){this._size.width=parseInt(width);
this._native.setAttribute("width",parseInt(width))
}if($defined(height)&&this._size.height!=parseInt(height)){this._size.height=parseInt(height);
this._native.setAttribute("height",parseInt(height))
}web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
},getSize:function(){return{width:this._size.width,height:this._size.height}
},setFill:function(color,opacity){if($defined(color)){this._native.setAttribute("fill",color)
}if($defined(opacity)){this._native.setAttribute("fill-opacity",opacity)
}},getFill:function(){var color=this._native.getAttribute("fill");
var opacity=this._native.getAttribute("fill-opacity");
return{color:color,opacity:Number(opacity)}
},getStroke:function(){var vmlStroke=this._native;
var color=vmlStroke.getAttribute("stroke");
var dashstyle=this._stokeStyle;
var opacity=vmlStroke.getAttribute("stroke-opacity");
var width=vmlStroke.getAttribute("stroke-width");
return{color:color,style:dashstyle,opacity:opacity,width:width}
},setStroke:function(width,style,color,opacity){if($defined(width)){this._native.setAttribute("stroke-width",width+"px")
}if($defined(color)){this._native.setAttribute("stroke",color)
}if($defined(style)){var dashArrayPoints=this.__stokeStyleToStrokDasharray[style];
var scale=1/web2d.peer.utils.TransformUtil.workoutScale(this).width;
var strokeWidth=this._native.getAttribute("stroke-width");
strokeWidth=parseFloat(strokeWidth);
var scaledPoints=[];
for(var i=0;
i<dashArrayPoints.length;
i++){scaledPoints[i]=dashArrayPoints[i]*strokeWidth;
scaledPoints[i]=(scaledPoints[i]*scale)+"px"
}this._stokeStyle=style
}if($defined(opacity)){this._native.setAttribute("stroke-opacity",opacity)
}},setVisibility:function(isVisible){this._native.setAttribute("visibility",(isVisible)?"visible":"hidden")
},isVisible:function(){var visibility=this._native.getAttribute("visibility");
return !(visibility=="hidden")
},updateStrokeStyle:function(){var strokeStyle=this._stokeStyle;
if(this.getParent()){if(strokeStyle&&strokeStyle!="solid"){this.setStroke(null,strokeStyle)
}}},attachChangeEventListener:function(type,listener){var listeners=this.getChangeEventListeners(type);
if(!$defined(listener)){throw"Listener can not be null"
}listeners.push(listener)
},getChangeEventListeners:function(type){var listeners=this._changeListeners[type];
if(!$defined(listeners)){listeners=[];
this._changeListeners[type]=listeners
}return listeners
},moveToFront:function(){this._native.parentNode.appendChild(this._native)
},moveToBack:function(){this._native.parentNode.insertBefore(this._native,this._native.parentNode.firstChild)
},setCursor:function(type){this._native.style.cursor=type
}});
web2d.peer.svg.ElementPeer.prototype.svgNamespace="http://www.w3.org/2000/svg";
web2d.peer.svg.ElementPeer.prototype.linkNamespace="http://www.w3.org/1999/xlink";
web2d.peer.svg.ElementPeer.prototype.__stokeStyleToStrokDasharray={solid:[],dot:[1,3],dash:[4,3],longdash:[10,2],dashdot:[5,3,1,3]};web2d.peer.svg.ElipsePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"ellipse");
this.parent(svgElement);
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
this._position={x:0,y:0}
},setSize:function(width,height){this.parent(width,height);
if($defined(width)){this._native.setAttribute("rx",width/2)
}if($defined(height)){this._native.setAttribute("ry",height/2)
}var pos=this.getPosition();
this.setPosition(pos.x,pos.y)
},setPosition:function(cx,cy){var size=this.getSize();
cx=cx+size.width/2;
cy=cy+size.height/2;
if($defined(cx)){this._native.setAttribute("cx",cx)
}if($defined(cy)){this._native.setAttribute("cy",cy)
}},getPosition:function(){return this._position
}});web2d.peer.svg.Font=new Class({initialize:function(){this._size=10;
this._style="normal";
this._weight="normal"
},init:function(args){if($defined(args.size)){this._size=parseInt(args.size)
}if($defined(args.style)){this._style=args.style
}if($defined(args.weight)){this._weight=args.weight
}},getHtmlSize:function(scale){var result=0;
if(this._size==6){result=this._size*scale.height*43/32
}if(this._size==8){result=this._size*scale.height*42/32
}else{if(this._size==10){result=this._size*scale.height*42/32
}else{if(this._size==15){result=this._size*scale.height*42/32
}}}return result
},getGraphSize:function(){return this._size*43/32
},getSize:function(){return parseInt(this._size)
},getStyle:function(){return this._style
},getWeight:function(){return this._weight
},setSize:function(size){this._size=size
},setStyle:function(style){this._style=style
},setWeight:function(weight){this._weight=weight
},getWidthMargin:function(){var result=0;
if(this._size==10||this._size==6){result=4
}return result
}});web2d.peer.svg.ArialFont=new Class({Extends:web2d.peer.svg.Font,initialize:function(){this.parent();
this._fontFamily="Arial"
},getFontFamily:function(){return this._fontFamily
},getFont:function(){return web2d.Font.ARIAL
}});web2d.peer.svg.PolyLinePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"polyline");
this.parent(svgElement);
this.setFill("none");
this.breakDistance=10
},setFrom:function(x1,y1){this._x1=x1;
this._y1=y1;
this._updatePath()
},setTo:function(x2,y2){this._x2=x2;
this._y2=y2;
this._updatePath()
},setStrokeWidth:function(width){this._native.setAttribute("stroke-width",width)
},setColor:function(color){this._native.setAttribute("stroke",color)
},setStyle:function(style){this._style=style;
this._updatePath()
},getStyle:function(){return this._style
},_updatePath:function(){if(this._style=="Curved"){this._updateMiddleCurvePath()
}else{if(this._style=="Straight"){this._updateStraightPath()
}else{this._updateCurvePath()
}}},_updateStraightPath:function(){if($defined(this._x1)&&$defined(this._x2)&&$defined(this._y1)&&$defined(this._y2)){var path=web2d.PolyLine.buildStraightPath(this.breakDistance,this._x1,this._y1,this._x2,this._y2);
this._native.setAttribute("points",path)
}},_updateMiddleCurvePath:function(){var x1=this._x1;
var y1=this._y1;
var x2=this._x2;
var y2=this._y2;
if($defined(x1)&&$defined(x2)&&$defined(y1)&&$defined(y2)){var diff=x2-x1;
var middlex=(diff/2)+x1;
var signx=1;
var signy=1;
if(diff<0){signx=-1
}if(y2<y1){signy=-1
}var path=x1+", "+y1+" "+(middlex-10*signx)+", "+y1+" "+middlex+", "+(y1+10*signy)+" "+middlex+", "+(y2-10*signy)+" "+(middlex+10*signx)+", "+y2+" "+x2+", "+y2;
this._native.setAttribute("points",path)
}},_updateCurvePath:function(){if($defined(this._x1)&&$defined(this._x2)&&$defined(this._y1)&&$defined(this._y2)){var path=web2d.PolyLine.buildCurvedPath(this.breakDistance,this._x1,this._y1,this._x2,this._y2);
this._native.setAttribute("points",path)
}}});web2d.peer.svg.CurvedLinePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"path");
this.parent(svgElement);
this._style={fill:"#495879"};
this._updateStyle();
this._customControlPoint_1=false;
this._customControlPoint_2=false;
this._control1=new core.Point();
this._control2=new core.Point();
this._lineStyle=true
},setSrcControlPoint:function(control){this._customControlPoint_1=true;
var change=this._control1.x!=control.x||this._control1.y!=control.y;
if($defined(control.x)){this._control1=control;
this._control1.x=parseInt(this._control1.x);
this._control1.y=parseInt(this._control1.y)
}if(change){this._updatePath()
}},setDestControlPoint:function(control){this._customControlPoint_2=true;
var change=this._control2.x!=control.x||this._control2.y!=control.y;
if($defined(control.x)){this._control2=control;
this._control2.x=parseInt(this._control2.x);
this._control2.y=parseInt(this._control2.y)
}if(change){this._updatePath()
}},isSrcControlPointCustom:function(){return this._customControlPoint_1
},isDestControlPointCustom:function(){return this._customControlPoint_2
},setIsSrcControlPointCustom:function(isCustom){this._customControlPoint_1=isCustom
},setIsDestControlPointCustom:function(isCustom){this._customControlPoint_2=isCustom
},getControlPoints:function(){return[this._control1,this._control2]
},setFrom:function(x1,y1){var change=this._x1!=parseInt(x1)||this._y1!=parseInt(y1);
this._x1=parseInt(x1);
this._y1=parseInt(y1);
if(change){this._updatePath()
}},setTo:function(x2,y2){var change=this._x2!=parseInt(x2)||this._y2!=parseInt(y2);
this._x2=parseInt(x2);
this._y2=parseInt(y2);
if(change){this._updatePath()
}},getFrom:function(){return new core.Point(this._x1,this._y1)
},getTo:function(){return new core.Point(this._x2,this._y2)
},setStrokeWidth:function(width){this._style["stroke-width"]=width;
this._updateStyle()
},setColor:function(color){this._style.stroke=color;
this._style.fill=color;
this._updateStyle()
},updateLine:function(avoidControlPointFix){this._updatePath(avoidControlPointFix)
},setLineStyle:function(style){this._lineStyle=style;
if(this._lineStyle){this._style.fill=this._fill
}else{this._fill=this._style.fill;
this._style.fill="none"
}this._updateStyle();
this.updateLine()
},getLineStyle:function(){return this._lineStyle
},setShowEndArrow:function(visible){this._showEndArrow=visible;
this.updateLine()
},isShowEndArrow:function(){return this._showEndArrow
},setShowStartArrow:function(visible){this._showStartArrow=visible;
this.updateLine()
},isShowStartArrow:function(){return this._showStartArrow
},_updatePath:function(avoidControlPointFix){if($defined(this._x1)&&$defined(this._y1)&&$defined(this._x2)&&$defined(this._y2)){this._calculateAutoControlPoints(avoidControlPointFix);
var path="M"+this._x1+","+this._y1+" C"+(this._control1.x+this._x1)+","+(this._control1.y+this._y1)+" "+(this._control2.x+this._x2)+","+(this._control2.y+this._y2)+" "+this._x2+","+this._y2+(this._lineStyle?" "+(this._control2.x+this._x2)+","+(this._control2.y+this._y2+3)+" "+(this._control1.x+this._x1)+","+(this._control1.y+this._y1+5)+" "+this._x1+","+(this._y1+7)+" Z":"");
this._native.setAttribute("d",path)
}},_updateStyle:function(){var style="";
for(var key in this._style){style+=key+":"+this._style[key]+" "
}this._native.setAttribute("style",style)
},_calculateAutoControlPoints:function(avoidControlPointFix){var defaultpoints=mindplot.util.Shape.calculateDefaultControlPoints(new core.Point(this._x1,this._y1),new core.Point(this._x2,this._y2));
if(!this._customControlPoint_1&&!($defined(avoidControlPointFix)&&avoidControlPointFix==0)){this._control1.x=defaultpoints[0].x;
this._control1.y=defaultpoints[0].y
}if(!this._customControlPoint_2&&!($defined(avoidControlPointFix)&&avoidControlPointFix==1)){this._control2.x=defaultpoints[1].x;
this._control2.y=defaultpoints[1].y
}},setDashed:function(length,spacing){if($defined(length)&&$defined(spacing)){this._native.setAttribute("stroke-dasharray",length+","+spacing)
}else{this._native.setAttribute("stroke-dasharray","")
}}});web2d.peer.svg.ArrowPeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"path");
this.parent(svgElement);
this._style={};
this._controlPoint=new core.Point();
this._fromPoint=new core.Point()
},setFrom:function(x,y){this._fromPoint.x=x;
this._fromPoint.y=y;
this._redraw()
},setControlPoint:function(point){this._controlPoint=point;
this._redraw()
},setStrokeColor:function(color){this.setStroke(null,null,color,null)
},setStrokeWidth:function(width){this.setStroke(width)
},setDashed:function(isDashed,length,spacing){if($defined(isDashed)&&isDashed&&$defined(length)&&$defined(spacing)){this._native.setAttribute("stroke-dasharray",length+","+spacing)
}else{this._native.setAttribute("stroke-dasharray","")
}},_updateStyle:function(){var style="";
for(var key in this._style){style+=key+":"+this._style[key]+" "
}this._native.setAttribute("style",style)
},_redraw:function(){var x,y,xp,yp;
if($defined(this._fromPoint.x)&&$defined(this._fromPoint.y)&&$defined(this._controlPoint.x)&&$defined(this._controlPoint.y)){if(this._controlPoint.y==0){this._controlPoint.y=1
}var y0=this._controlPoint.y;
var x0=this._controlPoint.x;
var x2=x0+y0;
var y2=y0-x0;
var x3=x0-y0;
var y3=y0+x0;
var m=y2/x2;
var mp=y3/x3;
var l=6;
var pow=Math.pow;
x=(x2==0?0:Math.sqrt(pow(l,2)/(1+pow(m,2))));
x*=Math.sign(x2);
y=(x2==0?l*Math.sign(y2):m*x);
xp=(x3==0?0:Math.sqrt(pow(l,2)/(1+pow(mp,2))));
xp*=Math.sign(x3);
yp=(x3==0?l*Math.sign(y3):mp*xp);
var path="M"+this._fromPoint.x+","+this._fromPoint.y+" L"+(x+this._fromPoint.x)+","+(y+this._fromPoint.y)+"M"+this._fromPoint.x+","+this._fromPoint.y+" L"+(xp+this._fromPoint.x)+","+(yp+this._fromPoint.y);
this._native.setAttribute("d",path)
}}});web2d.peer.svg.TextPeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"text");
this.parent(svgElement);
this._position={x:0,y:0};
this._font=new web2d.Font("Arial",this)
},append:function(element){this._native.appendChild(element._native)
},setTextAlignment:function(align){this._textAlign=align
},getTextAlignment:function(){return $defined(this._textAlign)?this._textAlign:"left"
},setText:function(text){while(this._native.firstChild){this._native.removeChild(this._native.firstChild)
}this._text=text;
if(text){var lines=text.split("\n");
var me=this;
lines.forEach(function(line){var tspan=window.document.createElementNS(me.svgNamespace,"tspan");
tspan.setAttribute("dy","1em");
tspan.setAttribute("x",me.getPosition().x);
tspan.textContent=line.length==0?" ":line;
me._native.appendChild(tspan)
})
}},getText:function(){return this._text
},setPosition:function(x,y){this._position={x:x,y:y};
this._native.setAttribute("y",y);
this._native.setAttribute("x",x);
$(this._native).children("tspan").attr("x",x)
},getPosition:function(){return this._position
},getNativePosition:function(){return $(this._native).position()
},setFont:function(font,size,style,weight){if($defined(font)){this._font=new web2d.Font(font,this)
}if($defined(style)){this._font.setStyle(style)
}if($defined(weight)){this._font.setWeight(weight)
}if($defined(size)){this._font.setSize(size)
}this._updateFontStyle()
},_updateFontStyle:function(){this._native.setAttribute("font-family",this._font.getFontFamily());
this._native.setAttribute("font-size",this._font.getGraphSize());
this._native.setAttribute("font-style",this._font.getStyle());
this._native.setAttribute("font-weight",this._font.getWeight())
},setColor:function(color){this._native.setAttribute("fill",color)
},getColor:function(){return this._native.getAttribute("fill")
},setTextSize:function(size){this._font.setSize(size);
this._updateFontStyle()
},setContentSize:function(width,height){this._native.xTextSize=width.toFixed(1)+","+height.toFixed(1)
},setStyle:function(style){this._font.setStyle(style);
this._updateFontStyle()
},setWeight:function(weight){this._font.setWeight(weight);
this._updateFontStyle()
},setFontFamily:function(family){var oldFont=this._font;
this._font=new web2d.Font(family,this);
this._font.setSize(oldFont.getSize());
this._font.setStyle(oldFont.getStyle());
this._font.setWeight(oldFont.getWeight());
this._updateFontStyle()
},getFont:function(){return{font:this._font.getFont(),size:parseInt(this._font.getSize()),style:this._font.getStyle(),weight:this._font.getWeight()}
},setSize:function(size){this._font.setSize(size);
this._updateFontStyle()
},getWidth:function(){var computedWidth;
try{computedWidth=this._native.getBBox().width;
if(computedWidth==0){var bbox=this._native.getBBox();
computedWidth=bbox.width
}}catch(e){computedWidth=10
}var width=parseInt(computedWidth);
width=width+this._font.getWidthMargin();
return width
},getHeight:function(){try{var computedHeight=this._native.getBBox().height
}catch(e){computedHeight=10
}return parseInt(computedHeight)
},getHtmlFontSize:function(){return this._font.getHtmlSize()
}});web2d.peer.svg.WorkspacePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(element){this._element=element;
var svgElement=window.document.createElementNS(this.svgNamespace,"svg");
this.parent(svgElement);
this._native.setAttribute("focusable","true");
this._native.setAttribute("id","workspace");
this._native.setAttribute("preserveAspectRatio","none")
},setCoordSize:function(width,height){var viewBox=this._native.getAttribute("viewBox");
var coords=[0,0,0,0];
if(viewBox!=null){coords=viewBox.split(/ /)
}if($defined(width)){coords[2]=width
}if($defined(height)){coords[3]=height
}this._native.setAttribute("viewBox",coords.join(" "));
this._native.setAttribute("preserveAspectRatio","none");
web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
},getCoordSize:function(){var viewBox=this._native.getAttribute("viewBox");
var coords=[1,1,1,1];
if(viewBox!=null){coords=viewBox.split(/ /)
}return{width:coords[2],height:coords[3]}
},setCoordOrigin:function(x,y){var viewBox=this._native.getAttribute("viewBox");
var coords=[0,0,0,0];
if(viewBox!=null){coords=viewBox.split(/ /)
}if($defined(x)){coords[0]=x
}if($defined(y)){coords[1]=y
}this._native.setAttribute("viewBox",coords.join(" "))
},append:function(child){this.parent(child);
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,"onChangeCoordSize")
},getCoordOrigin:function(child){var viewBox=this._native.getAttribute("viewBox");
var coords=[1,1,1,1];
if(viewBox!=null){coords=viewBox.split(/ /)
}var x=parseFloat(coords[0]);
var y=parseFloat(coords[1]);
return{x:x,y:y}
},getPosition:function(){return{x:0,y:0}
}});web2d.peer.svg.GroupPeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"g");
this.parent(svgElement);
this._native.setAttribute("preserveAspectRatio","none");
this._coordSize={width:1,height:1};
this._native.setAttribute("focusable","true");
this._position={x:0,y:0};
this._coordOrigin={x:0,y:0}
},setCoordSize:function(width,height){var change=this._coordSize.width!=width||this._coordSize.height!=height;
this._coordSize.width=width;
this._coordSize.height=height;
if(change){this.updateTransform()
}web2d.peer.utils.EventUtils.broadcastChangeEvent(this,"strokeStyle")
},getCoordSize:function(){return{width:this._coordSize.width,height:this._coordSize.height}
},updateTransform:function(){var sx=this._size.width/this._coordSize.width;
var sy=this._size.height/this._coordSize.height;
var cx=this._position.x-this._coordOrigin.x*sx;
var cy=this._position.y-this._coordOrigin.y*sy;
cx=isNaN(cx)?0:cx;
cy=isNaN(cy)?0:cy;
sx=isNaN(sx)?0:sx;
sy=isNaN(sy)?0:sy;
this._native.setAttribute("transform","translate("+cx+","+cy+") scale("+sx+","+sy+")")
},setOpacity:function(value){this._native.setAttribute("opacity",value)
},setCoordOrigin:function(x,y){var change=x!=this._coordOrigin.x||y!=this._coordOrigin.y;
if($defined(x)){this._coordOrigin.x=x
}if($defined(y)){this._coordOrigin.y=y
}if(change){this.updateTransform()
}},setSize:function(width,height){var change=width!=this._size.width||height!=this._size.height;
this.parent(width,height);
if(change){this.updateTransform()
}},setPosition:function(x,y){var change=x!=this._position.x||y!=this._position.y;
if($defined(x)){this._position.x=parseInt(x)
}if($defined(y)){this._position.y=parseInt(y)
}if(change){this.updateTransform()
}},getPosition:function(){return{x:this._position.x,y:this._position.y}
},append:function(child){this.parent(child);
web2d.peer.utils.EventUtils.broadcastChangeEvent(child,"onChangeCoordSize")
},getCoordOrigin:function(){return{x:this._coordOrigin.x,y:this._coordOrigin.y}
}});web2d.peer.svg.RectPeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(arc){var svgElement=window.document.createElementNS(this.svgNamespace,"rect");
this.parent(svgElement);
this._arc=arc;
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle)
},setPosition:function(x,y){if($defined(x)){this._native.setAttribute("x",parseInt(x))
}if($defined(y)){this._native.setAttribute("y",parseInt(y))
}},getPosition:function(){var x=this._native.getAttribute("x");
var y=this._native.getAttribute("y");
return{x:parseInt(x),y:parseInt(y)}
},setSize:function(width,height){this.parent(width,height);
var min=width<height?width:height;
if($defined(this._arc)){var arc=(min/2)*this._arc;
this._native.setAttribute("rx",arc);
this._native.setAttribute("ry",arc)
}}});web2d.peer.svg.ImagePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"image");
this.parent(svgElement);
this._position={x:0,y:0};
this._href="";
this._native.setAttribute("preserveAspectRatio","none")
},setPosition:function(x,y){this._position={x:x,y:y};
this._native.setAttribute("y",y);
this._native.setAttribute("x",x)
},getPosition:function(){return this._position
},setHref:function(url){this._native.setAttributeNS(this.linkNamespace,"href",url);
this._href=url
},getHref:function(){return this._href
}});web2d.peer.svg.TimesFont=new Class({Extends:web2d.peer.svg.Font,initialize:function(){this.parent();
this._fontFamily="times"
},getFontFamily:function(){return this._fontFamily
},getFont:function(){return web2d.Font.TIMES
}});web2d.peer.svg.LinePeer=new Class({Extends:web2d.peer.svg.ElementPeer,initialize:function(){var svgElement=window.document.createElementNS(this.svgNamespace,"line");
this.parent(svgElement);
this.attachChangeEventListener("strokeStyle",web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle)
},setFrom:function(x1,y1){this._x1=x1;
this._y1=y1;
this._native.setAttribute("x1",x1);
this._native.setAttribute("y1",y1)
},setTo:function(x2,y2){this._x2=x2;
this._y2=y2;
this._native.setAttribute("x2",x2);
this._native.setAttribute("y2",y2)
},getFrom:function(){return new core.Point(this._x1,this._y1)
},getTo:function(){return new core.Point(this._x2,this._y2)
},setArrowStyle:function(startStyle,endStyle){if($defined(startStyle)){}if($defined(endStyle)){}}});web2d.peer.svg.TahomaFont=new Class({Extends:web2d.peer.svg.Font,initialize:function(){this.parent();
this._fontFamily="tahoma"
},getFontFamily:function(){return this._fontFamily
},getFont:function(){return web2d.Font.TAHOMA
}});web2d.peer.svg.VerdanaFont=new Class({Extends:web2d.peer.svg.Font,initialize:function(){this.parent();
this._fontFamily="verdana"
},getFontFamily:function(){return this._fontFamily
},getFont:function(){return web2d.Font.VERDANA
}});web2d.Element=new Class({initialize:function(peer,attributes){this._peer=peer;
if(peer==null){throw new Error("Element peer can not be null")
}if($defined(attributes)){this._initialize(attributes)
}},_initialize:function(attributes){var batchExecute={};
for(var key in attributes){var funcName=this._attributeNameToFuncName(key,"set");
var funcArgs=batchExecute[funcName];
if(!$defined(funcArgs)){funcArgs=[]
}var signature=web2d.Element._propertyNameToSignature[key];
var argPositions=signature[1];
if(argPositions!=web2d.Element._SIGNATURE_MULTIPLE_ARGUMENTS){funcArgs[argPositions]=attributes[key]
}else{funcArgs=attributes[key].split(" ")
}batchExecute[funcName]=funcArgs
}for(var key in batchExecute){var func=this[key];
if(!$defined(func)){throw new Error("Could not find function: "+key)
}func.apply(this,batchExecute[key])
}},setSize:function(width,height){this._peer.setSize(width,height)
},setPosition:function(cx,cy){this._peer.setPosition(cx,cy)
},addEvent:function(type,listener){this._peer.addEvent(type,listener)
},trigger:function(type,event){this._peer.trigger(type,event)
},cloneEvents:function(from){this._peer.cloneEvents(from)
},removeEvent:function(type,listener){this._peer.removeEvent(type,listener)
},getType:function(){throw new Error("Not implemeneted yet. This method must be implemented by all the inherited objects.")
},getFill:function(){return this._peer.getFill()
},setFill:function(color,opacity){this._peer.setFill(color,opacity)
},getPosition:function(){return this._peer.getPosition()
},getNativePosition:function(){return this._peer.getNativePosition()
},setStroke:function(width,style,color,opacity){if(style!=null&&style!=undefined&&style!="dash"&&style!="dot"&&style!="solid"&&style!="longdash"&&style!="dashdot"){throw new Error("Unsupported stroke style: '"+style+"'")
}this._peer.setStroke(width,style,color,opacity)
},_attributeNameToFuncName:function(attributeKey,prefix){var signature=web2d.Element._propertyNameToSignature[attributeKey];
if(!$defined(signature)){throw"Unsupported attribute: "+attributeKey
}var firstLetter=signature[0].charAt(0);
return prefix+firstLetter.toUpperCase()+signature[0].substring(1)
},setAttribute:function(key,value){var funcName=this._attributeNameToFuncName(key,"set");
var signature=web2d.Element._propertyNameToSignature[key];
if(signature==null){throw"Could not find the signature for:"+key
}var argPositions=signature[1];
var args=[];
if(argPositions!==this._SIGNATURE_MULTIPLE_ARGUMENTS){args[argPositions]=value
}else{if(typeof value=="array"){args=value
}else{var strValue=String(value);
args=strValue.split(" ")
}}var setter=this[funcName];
if(setter==null){throw"Could not find the function name:"+funcName
}setter.apply(this,args)
},getAttribute:function(key){var funcName=this._attributeNameToFuncName(key,"get");
var signature=web2d.Element._propertyNameToSignature[key];
if(signature==null){throw"Could not find the signature for:"+key
}var getter=this[funcName];
if(getter==null){throw"Could not find the function name:"+funcName
}var getterResult=getter.apply(this,[]);
var attibuteName=signature[2];
if(!$defined(attibuteName)){throw"Could not find attribute mapping for:"+key
}var result=getterResult[attibuteName];
if(!$defined(result)){throw"Could not find attribute with name:"+attibuteName
}return result
},setOpacity:function(opacity){this._peer.setStroke(null,null,null,opacity);
this._peer.setFill(null,opacity)
},setVisibility:function(isVisible){this._peer.setVisibility(isVisible)
},isVisible:function(){return this._peer.isVisible()
},moveToFront:function(){this._peer.moveToFront()
},moveToBack:function(){this._peer.moveToBack()
},getStroke:function(){return this._peer.getStroke()
},setCursor:function(type){this._peer.setCursor(type)
},getParent:function(){return this._peer.getParent()
}});
web2d.Element._SIGNATURE_MULTIPLE_ARGUMENTS=-1;
web2d.Element._supportedEvents=["click","dblclick","mousemove","mouseout","mouseover","mousedown","mouseup"];
web2d.Element._propertyNameToSignature={size:["size",-1],width:["size",0,"width"],height:["size",1,"height"],position:["position",-1],x:["position",0,"x"],y:["position",1,"y"],stroke:["stroke",-1],strokeWidth:["stroke",0,"width"],strokeStyle:["stroke",1,"style"],strokeColor:["stroke",2,"color"],strokeOpacity:["stroke",3,"opacity"],fill:["fill",-1],fillColor:["fill",0,"color"],fillOpacity:["fill",1,"opacity"],coordSize:["coordSize",-1],coordSizeWidth:["coordSize",0,"width"],coordSizeHeight:["coordSize",1,"height"],coordOrigin:["coordOrigin",-1],coordOriginX:["coordOrigin",0,"x"],coordOriginY:["coordOrigin",1,"y"],visibility:["visibility",0],opacity:["opacity",0]};web2d.Elipse=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createElipse();
var defaultAttributes={width:40,height:40,x:5,y:5,stroke:"1 solid black",fillColor:"blue"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"Elipse"
},getSize:function(){return this._peer.getSize()
}});web2d.Font=new Class({initialize:function(fontFamily,textPeer){var font="web2d.peer.Toolkit.create"+fontFamily+"Font();";
this._peer=eval(font);
this._textPeer=textPeer
},getHtmlSize:function(){var scale=web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
return this._peer.getHtmlSize(scale)
},getGraphSize:function(){var scale=web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
return this._peer.getGraphSize(scale)
},getFontScale:function(){return web2d.peer.utils.TransformUtil.workoutScale(this._textPeer).height
},getSize:function(){return this._peer.getSize()
},getStyle:function(){return this._peer.getStyle()
},getWeight:function(){return this._peer.getWeight()
},getFontFamily:function(){return this._peer.getFontFamily()
},setSize:function(size){return this._peer.setSize(size)
},setStyle:function(style){return this._peer.setStyle(style)
},setWeight:function(weight){return this._peer.setWeight(weight)
},getFont:function(){return this._peer.getFont()
},getWidthMargin:function(){return this._peer.getWidthMargin()
}});
web2d.Font.ARIAL="Arial";
web2d.Font.TIMES="Times";
web2d.Font.TAHOMA="Tahoma";
web2d.Font.VERDANA="Verdana";web2d.Group=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createGroup();
var defaultAttributes={width:50,height:50,x:50,y:50,coordOrigin:"0 0",coordSize:"50 50"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},removeChild:function(element){if(!$defined(element)){throw"Child element can not be null"
}if(element==this){throw"It's not possible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}this._peer.removeChild(element._peer)
},append:function(element){if(!$defined(element)){throw"Child element can not be null"
}if(element==this){throw"It's not posible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}if(elementType=="Workspace"){throw"A group can not have a workspace as a child"
}this._peer.append(element._peer)
},getType:function(){return"Group"
},setCoordSize:function(width,height){this._peer.setCoordSize(width,height)
},setCoordOrigin:function(x,y){this._peer.setCoordOrigin(x,y)
},getCoordOrigin:function(){return this._peer.getCoordOrigin()
},getSize:function(){return this._peer.getSize()
},setFill:function(color,opacity){throw"Unsupported operation. Fill can not be set to a group"
},setStroke:function(width,style,color,opacity){throw"Unsupported operation. Stroke can not be set to a group"
},getCoordSize:function(){return this._peer.getCoordSize()
},appendDomChild:function(DomElement){if(!$defined(DomElement)){throw"Child element can not be null"
}if(DomElement==this){throw"It's not possible to add the group as a child of itself"
}this._peer._native.append(DomElement)
},setOpacity:function(value){this._peer.setOpacity(value)
}});web2d.Image=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createImage();
this.parent(peer,attributes)
},getType:function(){return"Image"
},setHref:function(href){this._peer.setHref(href)
},getHref:function(){return this._peer.getHref()
},getSize:function(){return this._peer.getSize()
}});web2d.Line=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createLine();
var defaultAttributes={strokeColor:"#495879",strokeWidth:1,strokeOpacity:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"Line"
},setFrom:function(x,y){this._peer.setFrom(x,y)
},setTo:function(x,y){this._peer.setTo(x,y)
},getFrom:function(){return this._peer.getFrom()
},getTo:function(){return this._peer.getTo()
},setArrowStyle:function(startStyle,endStyle){this._peer.setArrowStyle(startStyle,endStyle)
},setPosition:function(cx,cy){throw"Unsupported operation"
},setSize:function(width,height){throw"Unsupported operation"
},setFill:function(color,opacity){throw"Unsupported operation"
}});web2d.PolyLine=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createPolyLine();
var defaultAttributes={strokeColor:"blue",strokeWidth:1,strokeStyle:"solid",strokeOpacity:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"PolyLine"
},setFrom:function(x,y){this._peer.setFrom(x,y)
},setTo:function(x,y){this._peer.setTo(x,y)
},setStyle:function(style){this._peer.setStyle(style)
},getStyle:function(){return this._peer.getStyle()
},buildCurvedPath:function(dist,x1,y1,x2,y2){var signx=1;
var signy=1;
if(x2<x1){signx=-1
}if(y2<y1){signy=-1
}var path;
if(Math.abs(y1-y2)>2){var middlex=x1+((x2-x1>0)?dist:-dist);
path=x1.toFixed(1)+", "+y1.toFixed(1)+" "+middlex.toFixed(1)+", "+y1.toFixed(1)+" "+middlex.toFixed(1)+", "+(y2-5*signy).toFixed(1)+" "+(middlex+5*signx).toFixed(1)+", "+y2.toFixed(1)+" "+x2.toFixed(1)+", "+y2.toFixed(1)
}else{path=x1.toFixed(1)+", "+y1.toFixed(1)+" "+x2.toFixed(1)+", "+y2.toFixed(1)
}return path
},buildStraightPath:function(dist,x1,y1,x2,y2){var middlex=x1+((x2-x1>0)?dist:-dist);
return x1+", "+y1+" "+middlex+", "+y1+" "+middlex+", "+y2+" "+x2+", "+y2
}});web2d.CurvedLine=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createCurvedLine();
var defaultAttributes={strokeColor:"blue",strokeWidth:1,strokeStyle:"solid",strokeOpacity:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"CurvedLine"
},setFrom:function(x,y){$assert(!isNaN(x),"x must be defined");
$assert(!isNaN(y),"y must be defined");
this._peer.setFrom(x,y)
},setTo:function(x,y){$assert(!isNaN(x),"x must be defined");
$assert(!isNaN(y),"y must be defined");
this._peer.setTo(x,y)
},getFrom:function(){return this._peer.getFrom()
},getTo:function(){return this._peer.getTo()
},setShowEndArrow:function(visible){this._peer.setShowEndArrow(visible)
},isShowEndArrow:function(){return this._peer.isShowEndArrow()
},setShowStartArrow:function(visible){this._peer.setShowStartArrow(visible)
},isShowStartArrow:function(){return this._peer.isShowStartArrow()
},setSrcControlPoint:function(control){this._peer.setSrcControlPoint(control)
},setDestControlPoint:function(control){this._peer.setDestControlPoint(control)
},getControlPoints:function(){return this._peer.getControlPoints()
},isSrcControlPointCustom:function(){return this._peer.isSrcControlPointCustom()
},isDestControlPointCustom:function(){return this._peer.isDestControlPointCustom()
},setIsSrcControlPointCustom:function(isCustom){this._peer.setIsSrcControlPointCustom(isCustom)
},setIsDestControlPointCustom:function(isCustom){this._peer.setIsDestControlPointCustom(isCustom)
},updateLine:function(avoidControlPointFix){return this._peer.updateLine(avoidControlPointFix)
},setStyle:function(style){this._peer.setLineStyle(style)
},getStyle:function(){return this._peer.getLineStyle()
},setDashed:function(length,spacing){this._peer.setDashed(length,spacing)
}});
web2d.CurvedLine.SIMPLE_LINE=false;
web2d.CurvedLine.NICE_LINE=true;web2d.Arrow=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createArrow();
var defaultAttributes={strokeColor:"black",strokeWidth:1,strokeStyle:"solid",strokeOpacity:1};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"Arrow"
},setFrom:function(x,y){this._peer.setFrom(x,y)
},setControlPoint:function(point){this._peer.setControlPoint(point)
},setStrokeColor:function(color){this._peer.setStrokeColor(color)
},setStrokeWidth:function(width){this._peer.setStrokeWidth(width)
},setDashed:function(isDashed,length,spacing){this._peer.setDashed(isDashed,length,spacing)
}});web2d.Rect=new Class({Extends:web2d.Element,initialize:function(arc,attributes){if(arc&&arc>1){throw"Arc must be 0<=arc<=1"
}if(arguments.length<=0){var rx=0;
var ry=0
}var peer=web2d.peer.Toolkit.createRect(arc);
var defaultAttributes={width:40,height:40,x:5,y:5,stroke:"1 solid black",fillColor:"green"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes)
},getType:function(){return"Rect"
},getSize:function(){return this._peer.getSize()
}});web2d.Text=new Class({Extends:web2d.Element,initialize:function(attributes){var peer=web2d.peer.Toolkit.createText();
this.parent(peer,attributes)
},getType:function(){return"Text"
},setText:function(text){this._peer.setText(text)
},setTextAlignment:function(align){$assert(align,"align can not be null");
this._peer.setTextAlignment(align)
},setTextSize:function(width,height){this._peer.setContentSize(width,height)
},getText:function(){return this._peer.getText()
},setFont:function(font,size,style,weight){this._peer.setFont(font,size,style,weight)
},setColor:function(color){this._peer.setColor(color)
},getColor:function(){return this._peer.getColor()
},setStyle:function(style){this._peer.setStyle(style)
},setWeight:function(weight){this._peer.setWeight(weight)
},setFontFamily:function(family){this._peer.setFontFamily(family)
},getFont:function(){return this._peer.getFont()
},setSize:function(size){this._peer.setSize(size)
},getHtmlFontSize:function(){return this._peer.getHtmlFontSize()
},getWidth:function(){return this._peer.getWidth()
},getHeight:function(){return parseInt(this._peer.getHeight())
},getFontHeight:function(){var lines=this._peer.getText().split("\n").length;
return Math.round(this.getHeight()/lines)
}});web2d.peer.ToolkitSVG={init:function(){},createWorkspace:function(element){return new web2d.peer.svg.WorkspacePeer(element)
},createGroup:function(element){return new web2d.peer.svg.GroupPeer()
},createElipse:function(){return new web2d.peer.svg.ElipsePeer()
},createLine:function(){return new web2d.peer.svg.LinePeer()
},createPolyLine:function(){return new web2d.peer.svg.PolyLinePeer()
},createCurvedLine:function(){return new web2d.peer.svg.CurvedLinePeer()
},createArrow:function(){return new web2d.peer.svg.ArrowPeer()
},createText:function(){return new web2d.peer.svg.TextPeer()
},createImage:function(){return new web2d.peer.svg.ImagePeer()
},createRect:function(arc){return new web2d.peer.svg.RectPeer(arc)
},createArialFont:function(){return new web2d.peer.svg.ArialFont()
},createTimesFont:function(){return new web2d.peer.svg.TimesFont()
},createVerdanaFont:function(){return new web2d.peer.svg.VerdanaFont()
},createTahomaFont:function(){return new web2d.peer.svg.TahomaFont()
}};
web2d.peer.Toolkit=web2d.peer.ToolkitSVG;web2d.Workspace=new Class({Extends:web2d.Element,initialize:function(attributes){this._htmlContainer=this._createDivContainer();
var peer=web2d.peer.Toolkit.createWorkspace(this._htmlContainer);
var defaultAttributes={width:"200px",height:"200px",stroke:"1px solid #edf1be",fillColor:"white",coordOrigin:"0 0",coordSize:"200 200"};
for(var key in attributes){defaultAttributes[key]=attributes[key]
}this.parent(peer,defaultAttributes);
this._htmlContainer.append(this._peer._native)
},getType:function(){return"Workspace"
},append:function(element){if(!$defined(element)){throw"Child element can not be null"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}if(elementType=="Workspace"){throw"A workspace can not have a workspace as a child"
}this._peer.append(element._peer)
},addItAsChildTo:function(element){if(!$defined(element)){throw"Workspace div container can not be null"
}element.append(this._htmlContainer)
},_createDivContainer:function(){var container=window.document.createElement("div");
container.id="workspaceContainer";
container.style.position="relative";
container.style.top="0px";
container.style.left="0px";
container.style.height="688px";
container.style.border="1px solid red";
return $(container)
},setSize:function(width,height){if($defined(width)){this._htmlContainer.css("width",width)
}if($defined(height)){this._htmlContainer.css("height",height)
}this._peer.setSize(width,height)
},setCoordSize:function(width,height){this._peer.setCoordSize(width,height)
},setCoordOrigin:function(x,y){this._peer.setCoordOrigin(x,y)
},getCoordOrigin:function(){return this._peer.getCoordOrigin()
},_getHtmlContainer:function(){return this._htmlContainer
},setFill:function(color,opacity){this._htmlContainer.css("background-color",color);
if(opacity||opacity===0){throw"Unsupported operation. Opacity not supported."
}},getFill:function(){var color=this._htmlContainer.css("background-color");
return{color:color}
},getSize:function(){var width=this._htmlContainer.css("width");
var height=this._htmlContainer.css("height");
return{width:width,height:height}
},setStroke:function(width,style,color,opacity){if(style!="solid"){throw"Not supported style stroke style:"+style
}this._htmlContainer.css("border",width+" "+style+" "+color);
if(opacity||opacity===0){throw"Unsupported operation. Opacity not supported."
}},getCoordSize:function(){return this._peer.getCoordSize()
},removeChild:function(element){if(!$defined(element)){throw"Child element can not be null"
}if(element==this){throw"It's not possible to add the group as a child of itself"
}var elementType=element.getType();
if(elementType==null){throw"It seems not to be an element ->"+element
}this._peer.removeChild(element._peer)
},dumpNativeChart:function(){var elem=this._htmlContainer;
return elem.innerHTML
}});core.Point=new Class({initialize:function(x,y){this.x=x;
this.y=y
},setValue:function(x,y){this.x=x;
this.y=y
},inspect:function(){return"{x:"+this.x+",y:"+this.y+"}"
},clone:function(){return new core.Point(this.x,this.y)
}});
core.Point.fromString=function(point){var values=point.split(",");
return new core.Point(values[0],values[1])
};mindplot.Messages=new Class({Static:{init:function(a){a=$defined(a)?a:"en";
var b=mindplot.Messages.BUNDLES[a];
if(b==null&&a.indexOf("_")!=-1){a=a.substring(0,a.indexOf("_"));
b=mindplot.Messages.BUNDLES[a]
}mindplot.Messages.__bundle=b
}}});
$msg=function(a){if(!mindplot.Messages.__bundle){mindplot.Messages.init("en")
}var b=mindplot.Messages.__bundle[a];
return b?b:a
};
mindplot.Messages.BUNDLES={};mindplot.TopicEventDispatcher=new Class({Extends:mindplot.Events,Static:{_instance:null,configure:function(a){this._instance=new mindplot.TopicEventDispatcher(a)
},getInstance:function(){return this._instance
}},initialize:function(a){this._readOnly=a;
this._activeEditor=null;
this._multilineEditor=new mindplot.MultilineTextEditor()
},close:function(a){if(this.isVisible()){this._activeEditor.close(a);
this._activeEditor=null
}},show:function(b,a){this.process(mindplot.TopicEvent.EDIT,b,a)
},process:function(d,c,b){$assert(d,"eventType can not be null");
if(this.isVisible()){this.close()
}var a=c.getModel();
if(a.getShapeType()!=mindplot.model.TopicShape.IMAGE&&!this._readOnly&&d==mindplot.TopicEvent.EDIT){this._multilineEditor.show(c,b?b.text:null);
this._activeEditor=this._multilineEditor
}else{this.fireEvent(d,{model:a,readOnly:this._readOnly})
}},isVisible:function(){return this._activeEditor!=null&&this._activeEditor.isVisible()
}});
mindplot.TopicEvent={EDIT:"editnode",CLICK:"clicknode"};mindplot.model.IMindmap=new Class({initialize:function(){throw"Unsupported operation"
},getCentralTopic:function(){return this.getBranches()[0]
},getDescription:function(){throw"Unsupported operation"
},setDescription:function(a){throw"Unsupported operation"
},getId:function(){throw"Unsupported operation"
},setId:function(a){throw"Unsupported operation"
},getVersion:function(){throw"Unsupported operation"
},setVersion:function(a){throw"Unsupported operation"
},addBranch:function(a){throw"Unsupported operation"
},getBranches:function(){throw"Unsupported operation"
},removeBranch:function(a){throw"Unsupported operation"
},getRelationships:function(){throw"Unsupported operation"
},connect:function(a,b){$assert(!b.getParent(),"Child model seems to be already connected");
a.append(b);
this.removeBranch(b)
},disconnect:function(b){var a=b.getParent();
$assert(b,"Child can not be null.");
$assert(a,"Child model seems to be already connected");
a.removeChild(b);
this.addBranch(b)
},hasAlreadyAdded:function(a){throw"Unsupported operation"
},createNode:function(a,b){throw"Unsupported operation"
},createRelationship:function(b,a){throw"Unsupported operation"
},addRelationship:function(a){throw"Unsupported operation"
},deleteRelationship:function(a){throw"Unsupported operation"
},inspect:function(){var a="";
a="{ ";
var b=this.getBranches();
a=a+"version:"+this.getVersion();
a=a+" , [";
for(var c=0;
c<b.length;
c++){var d=b[c];
if(c!=0){a=a+",\n "
}a=a+"("+c+") =>"+d.inspect()
}a=a+"]";
a=a+" } ";
return a
},copyTo:function(d){var c=this;
var a=c.getVersion();
d.setVersion(a);
var e=this.getDescription();
d.setDescription(e);
var b=c.getBranches();
_.each(b,function(f){var g=d.createNode(f.getType(),f.getId());
f.copyTo(g);
d.addBranch(g)
})
}});mindplot.model.Mindmap=new Class({Extends:mindplot.model.IMindmap,initialize:function(b,a){$assert(b,"Id can not be null");
this._branches=[];
this._description=null;
this._relationships=[];
this._version=$defined(a)?a:mindplot.persistence.ModelCodeName.TANGO;
this._id=b
},getDescription:function(){return this._description
},setDescription:function(a){this._description=a
},getId:function(){return this._id
},setId:function(a){this._id=a
},getVersion:function(){return this._version
},setVersion:function(a){this._version=a
},addBranch:function(b){$assert(b&&b.isNodeModel(),"Add node must be invoked with model objects");
var a=this.getBranches();
if(a.length==0){$assert(b.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE,"First element must be the central topic");
b.setPosition(0,0)
}else{$assert(b.getType()!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE,"Mindmaps only have one cental topic")
}this._branches.push(b)
},removeBranch:function(a){$assert(a&&a.isNodeModel(),"Remove node must be invoked with model objects");
return this._branches.erase(a)
},getBranches:function(){return this._branches
},getRelationships:function(){return this._relationships
},hasAlreadyAdded:function(d){var a=false;
var b=this._branches;
for(var c=0;
c<b.length;
c++){a=b[c]._isChildNode(d);
if(a){break
}}},createNode:function(a,b){a=!$defined(a)?mindplot.model.INodeModel.MAIN_TOPIC_TYPE:a;
return new mindplot.model.NodeModel(a,this,b)
},createRelationship:function(a,b){$assert($defined(a),"from node cannot be null");
$assert($defined(b),"to node cannot be null");
return new mindplot.model.RelationshipModel(a,b)
},addRelationship:function(a){this._relationships.push(a)
},deleteRelationship:function(a){this._relationships.erase(a)
},findNodeById:function(d){var a=null;
for(var b=0;
b<this._branches.length;
b++){var c=this._branches[b];
a=c.findNodeById(d);
if(a){break
}}return a
}});
mindplot.model.Mindmap.buildEmpty=function(b){var a=new mindplot.model.Mindmap(b);
var c=a.createNode(mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE,0);
a.addBranch(c);
return a
};mindplot.model.INodeModel=new Class({initialize:function(a){$assert(a&&a.getBranches,"mindmap can not be null");
this._mindmap=a
},getId:function(){return this.getProperty("id")
},setId:function(a){if($defined(a)&&a>mindplot.model.INodeModel._uuid){mindplot.model.INodeModel._uuid=a
}if(!$defined(a)){a=mindplot.model.INodeModel._nextUUID()
}this.putProperty("id",a)
},getType:function(){return this.getProperty("type")
},setType:function(a){this.putProperty("type",a)
},setText:function(a){this.putProperty("text",a)
},getText:function(){return this.getProperty("text")
},setPosition:function(a,b){$assert(!isNaN(parseInt(a)),"x position is not valid:"+a);
$assert(!isNaN(parseInt(b)),"y position is not valid:"+b);
this.putProperty("position","{x:"+parseInt(a)+",y:"+parseInt(b)+"}")
},getPosition:function(){var value=this.getProperty("position");
var result=null;
if(value!=null){result=eval("("+value+")")
}return result
},setImageSize:function(b,a){this.putProperty("imageSize","{width:"+b+",height:"+a+"}")
},getImageSize:function(){var value=this.getProperty("imageSize");
var result=null;
if(value!=null){result=eval("("+value+")")
}return result
},setImageUrl:function(a){this.putProperty("imageUrl",a)
},getMetadata:function(){return this.getProperty("metadata")
},setMetadata:function(a){this.putProperty("metadata",a)
},getImageUrl:function(){return this.getProperty("imageUrl")
},getMindmap:function(){return this._mindmap
},disconnect:function(){var a=this.getMindmap();
a.disconnect(this)
},getShapeType:function(){return this.getProperty("shapeType")
},setShapeType:function(a){this.putProperty("shapeType",a)
},setOrder:function(a){$assert(typeof a==="number"&&isFinite(a)||a==null,"Order must be null or a number");
this.putProperty("order",a)
},getOrder:function(){return this.getProperty("order")
},setFontFamily:function(a){this.putProperty("fontFamily",a)
},getFontFamily:function(){return this.getProperty("fontFamily")
},setFontStyle:function(a){this.putProperty("fontStyle",a)
},getFontStyle:function(){return this.getProperty("fontStyle")
},setFontWeight:function(a){this.putProperty("fontWeight",a)
},getFontWeight:function(){return this.getProperty("fontWeight")
},setFontColor:function(a){this.putProperty("fontColor",a)
},getFontColor:function(){return this.getProperty("fontColor")
},setFontSize:function(a){this.putProperty("fontSize",a)
},getFontSize:function(){return this.getProperty("fontSize")
},getBorderColor:function(){return this.getProperty("borderColor")
},setBorderColor:function(a){this.putProperty("borderColor",a)
},getBackgroundColor:function(){return this.getProperty("backgroundColor")
},setBackgroundColor:function(a){this.putProperty("backgroundColor",a)
},areChildrenShrunken:function(){var a=this.getProperty("shrunken");
return $defined(a)?a:false
},setChildrenShrunken:function(a){this.putProperty("shrunken",a)
},isNodeModel:function(){return true
},isConnected:function(){return this.getParent()!=null
},append:function(a){throw"Unsupported operation"
},connectTo:function(b){$assert(b,"parent can not be null");
var a=this.getMindmap();
a.connect(b,this)
},copyTo:function(e){var d=this;
var c=d.getPropertiesKeys();
_.each(c,function(f){var g=d.getProperty(f);
e.putProperty(f,g)
});
var b=this.getChildren();
var a=e.getMindmap();
_.each(function(g,f){var h=a.createNode(f.getType(),f.getId());
f.copyTo(h);
e.append(h)
});
return e
},deleteNode:function(){var a=this.getMindmap();
var b=this.getParent();
if($defined(b)){b.removeChild(this)
}else{a.removeBranch(this)
}},getPropertiesKeys:function(){throw"Unsupported operation"
},putProperty:function(a,b){throw"Unsupported operation"
},setParent:function(a){throw"Unsupported operation"
},getChildren:function(){throw"Unsupported operation"
},getParent:function(){throw"Unsupported operation"
},clone:function(){throw"Unsupported operation"
},inspect:function(){var a="{ type: "+this.getType()+" , id: "+this.getId()+" , text: "+this.getText();
var b=this.getChildren();
if(b.length>0){a=a+", children: {(size:"+b.length;
_.each(b,function(d){a=a+"=> (";
var c=d.getPropertiesKeys();
_.each(c,function(e){var f=d.getProperty(e);
a=a+e+":"+f+","
});
a=a+"}"
})
}a=a+" }";
return a
},removeChild:function(a){throw"Unsupported operation"
}});
mindplot.model.TopicShape={RECTANGLE:"rectagle",ROUNDED_RECT:"rounded rectagle",ELLIPSE:"elipse",LINE:"line",IMAGE:"image"};
mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE="CentralTopic";
mindplot.model.INodeModel.MAIN_TOPIC_TYPE="MainTopic";
mindplot.model.INodeModel.MAIN_TOPIC_TO_MAIN_TOPIC_DISTANCE=220;
mindplot.model.INodeModel._nextUUID=function(){if(!$defined(mindplot.model.INodeModel._uuid)){mindplot.model.INodeModel._uuid=0
}mindplot.model.INodeModel._uuid=mindplot.model.INodeModel._uuid+1;
return mindplot.model.INodeModel._uuid
};
mindplot.model.INodeModel._uuid=0;mindplot.model.NodeModel=new Class({Extends:mindplot.model.INodeModel,initialize:function(b,a,c){$assert(b,"Node type can not be null");
$assert(a,"mindmap can not be null");
this._properties={};
this.parent(a);
this.setId(c);
this.setType(b);
this.areChildrenShrunken(false);
this._children=[];
this._feature=[]
},createFeature:function(b,a){return mindplot.TopicFeature.createModel(b,a)
},addFeature:function(a){$assert(a,"feature can not be null");
this._feature.push(a)
},getFeatures:function(){return this._feature
},removeFeature:function(b){$assert(b,"feature can not be null");
var a=this._feature.length;
this._feature=this._feature.filter(function(c){return b.getId()!=c.getId()
});
$assert(a-1==this._feature.length,"Could not be removed ...")
},findFeatureByType:function(a){$assert(a,"type can not be null");
return this._feature.filter(function(b){return b.getType()==a
})
},findFeatureById:function(b){$assert($defined(b),"id can not be null");
var a=this._feature.filter(function(c){return c.getId()==b
});
$assert(a.length==1,"Feature could not be found:"+b);
return a[0]
},getPropertiesKeys:function(){return Object.keys(this._properties)
},putProperty:function(a,b){$defined(a,"key can not be null");
this._properties[a]=b
},getProperties:function(){return this._properties
},getProperty:function(b){$defined(b,"key can not be null");
var a=this._properties[b];
return !$defined(a)?null:a
},clone:function(){var a=new mindplot.model.NodeModel(this.getType(),this._mindmap);
a._children=this._children.map(function(c){var b=c.clone();
b._parent=a;
return b
});
a._properties=Object.clone(this._properties);
a._feature=this._feature.clone();
return a
},deepCopy:function(){var a=new mindplot.model.NodeModel(this.getType(),this._mindmap);
a._children=this._children.map(function(d){var c=d.deepCopy();
c._parent=a;
return c
});
var b=a.getId();
a._properties=Object.clone(this._properties);
a.setId(b);
a._feature=this._feature.clone();
return a
},append:function(a){$assert(a&&a.isNodeModel(),"Only NodeModel can be appended to Mindmap object");
this._children.push(a);
a._parent=this
},removeChild:function(a){$assert(a&&a.isNodeModel(),"Only NodeModel can be appended to Mindmap object.");
this._children.erase(a);
a._parent=null
},getChildren:function(){return this._children
},getParent:function(){return this._parent
},setParent:function(a){$assert(a!=this,"The same node can not be parent and child if itself.");
this._parent=a
},_isChildNode:function(d){var a=false;
if(d==this){a=true
}else{var c=this.getChildren();
for(var b=0;
b<c.length;
b++){var e=c[b];
a=e._isChildNode(d);
if(a){break
}}}return a
},findNodeById:function(e){var a=null;
if(this.getId()==e){a=this
}else{var c=this.getChildren();
for(var b=0;
b<c.length;
b++){var d=c[b];
a=d.findNodeById(e);
if(a){break
}}}return a
}});mindplot.model.RelationshipModel=new Class({Static:{_nextUUID:function(){if(!$defined(mindplot.model.RelationshipModel._uuid)){mindplot.model.RelationshipModel._uuid=0
}mindplot.model.RelationshipModel._uuid=mindplot.model.RelationshipModel._uuid+1;
return mindplot.model.RelationshipModel._uuid
}},initialize:function(b,a){$assert($defined(b),"from node type can not be null");
$assert($defined(a),"to node type can not be null");
this._id=mindplot.model.RelationshipModel._nextUUID();
this._sourceTargetId=b;
this._targetTopicId=a;
this._lineType=mindplot.ConnectionLine.SIMPLE_CURVED;
this._srcCtrlPoint=null;
this._destCtrlPoint=null;
this._endArrow=true;
this._startArrow=false
},getFromNode:function(){return this._sourceTargetId
},getToNode:function(){return this._targetTopicId
},getId:function(){$assert(this._id,"id is null");
return this._id
},getLineType:function(){return this._lineType
},setLineType:function(a){this._lineType=a
},getSrcCtrlPoint:function(){return this._srcCtrlPoint
},setSrcCtrlPoint:function(a){this._srcCtrlPoint=a
},getDestCtrlPoint:function(){return this._destCtrlPoint
},setDestCtrlPoint:function(a){this._destCtrlPoint=a
},getEndArrow:function(){return this._endArrow
},setEndArrow:function(a){this._endArrow=a
},getStartArrow:function(){return this._startArrow
},setStartArrow:function(a){this._startArrow=a
},clone:function(){var a=new mindplot.model.RelationshipModel(this._sourceTargetId,this._targetTopicId);
a._id=this._id;
a._lineType=this._lineType;
a._srcCtrlPoint=this._srcCtrlPoint;
a._destCtrlPoint=this._destCtrlPoint;
a._endArrow=this._endArrow;
a._startArrow=this._startArrow;
return a
},inspect:function(){return"(fromNode:"+this.getFromNode().getId()+" , toNode: "+this.getToNode().getId()+")"
}});mindplot.ActionDispatcher=new Class({Implements:[mindplot.Events],initialize:function(a){$assert(a,"commandContext can not be null")
},addRelationship:function(b,a){throw"method must be implemented."
},addTopics:function(b,a){throw"method must be implemented."
},deleteEntities:function(a,b){throw"method must be implemented."
},dragTopic:function(d,b,a,c){throw"method must be implemented."
},moveTopic:function(b,a){throw"method must be implemented."
},moveControlPoint:function(b,a){throw"method must be implemented."
},changeFontFamilyToTopic:function(b,a){throw"method must be implemented."
},changeFontStyleToTopic:function(a){throw"method must be implemented."
},changeFontColorToTopic:function(b,a){throw"method must be implemented."
},changeFontSizeToTopic:function(a,b){throw"method must be implemented."
},changeBackgroundColorToTopic:function(b,a){throw"method must be implemented."
},changeBorderColorToTopic:function(b,a){throw"method must be implemented."
},changeShapeTypeToTopic:function(a,b){throw"method must be implemented."
},changeFontWeightToTopic:function(a){throw"method must be implemented."
},changeTextToTopic:function(a,b){throw"method must be implemented."
},shrinkBranch:function(a,b){throw"method must be implemented."
},addFeatureToTopic:function(c,b,a){throw"method must be implemented."
},changeFeatureToTopic:function(b,c,a){throw"method must be implemented."
},removeFeatureFromTopic:function(a,b){throw"method must be implemented."
}});
mindplot.ActionDispatcher.setInstance=function(a){mindplot.ActionDispatcher._instance=a
};
mindplot.ActionDispatcher.getInstance=function(){return mindplot.ActionDispatcher._instance
};mindplot.StandaloneActionDispatcher=new Class({Extends:mindplot.ActionDispatcher,initialize:function(a){this.parent(a);
this._actionRunner=new mindplot.DesignerActionRunner(a,this)
},addTopics:function(c,b){var a=new mindplot.commands.AddTopicCommand(c,b);
this.execute(a)
},addRelationship:function(a){var b=new mindplot.commands.AddRelationshipCommand(a);
this.execute(b)
},deleteEntities:function(a,b){var c=new mindplot.commands.DeleteCommand(a,b);
this.execute(c)
},dragTopic:function(d,b,a,c){var e=new mindplot.commands.DragTopicCommand(d,b,a,c);
this.execute(e)
},moveTopic:function(b,a){$assert($defined(b),"topicsId can not be null");
$assert($defined(a),"position can not be null");
var c=function(f,g){var e=f.getPosition();
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeMoveEvent,{node:f.getModel(),position:g});
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,b,a);
this.execute(d)
},moveControlPoint:function(b,a){var c=new mindplot.commands.MoveControlPointCommand(b,a);
this.execute(c)
},changeFontStyleToTopic:function(a){var b=function(e){var d=e.getFontStyle();
var f=(d=="italic")?"normal":"italic";
e.setFontStyle(f,true);
return d
};
var c=new mindplot.commands.GenericFunctionCommand(b,a);
this.execute(c)
},changeTextToTopic:function(a,d){$assert($defined(a),"topicsIds can not be null");
var b=function(f,g){var e=f.getText();
f.setText(g);
return e
};
b.commandType="changeTextToTopic";
var c=new mindplot.commands.GenericFunctionCommand(b,a,d);
this.execute(c)
},changeFontFamilyToTopic:function(d,a){$assert(d,"topicIds can not be null");
$assert(a,"fontFamily can not be null");
var b=function(g,f){var e=g.getFontFamily();
g.setFontFamily(f,true);
g._adjustShapes();
return e
};
var c=new mindplot.commands.GenericFunctionCommand(b,d,a);
this.execute(c)
},changeFontColorToTopic:function(b,a){$assert(b,"topicIds can not be null");
$assert(a,"color can not be null");
var c=function(g,f){var e=g.getFontColor();
g.setFontColor(f,true);
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,b,a);
d.discardDuplicated="fontColorCommandId";
this.execute(d)
},changeBackgroundColorToTopic:function(b,a){$assert(b,"topicIds can not be null");
$assert(a,"color can not be null");
var c=function(g,f){var e=g.getBackgroundColor();
g.setBackgroundColor(f);
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,b,a);
d.discardDuplicated="backColor";
this.execute(d)
},changeBorderColorToTopic:function(b,a){$assert(b,"topicIds can not be null");
$assert(a,"topicIds can not be null");
var c=function(g,f){var e=g.getBorderColor();
g.setBorderColor(f);
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,b,a);
d.discardDuplicated="borderColorCommandId";
this.execute(d)
},changeFontSizeToTopic:function(a,b){$assert(a,"topicIds can not be null");
$assert(b,"size can not be null");
var c=function(f,g){var e=f.getFontSize();
f.setFontSize(g,true);
f._adjustShapes();
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,a,b);
this.execute(d)
},changeShapeTypeToTopic:function(a,b){$assert(a,"topicsIds can not be null");
$assert(b,"shapeType can not be null");
var c=function(f,g){var e=f.getShapeType();
f.setShapeType(g,true);
return e
};
var d=new mindplot.commands.GenericFunctionCommand(c,a,b);
this.execute(d)
},changeFontWeightToTopic:function(a){$assert(a,"topicsIds can not be null");
var b=function(e){var d=e.getFontWeight();
var f=(d=="bold")?"normal":"bold";
e.setFontWeight(f,true);
e._adjustShapes();
return d
};
var c=new mindplot.commands.GenericFunctionCommand(b,a);
this.execute(c)
},shrinkBranch:function(a,d){$assert(a,"topicsIds can not be null");
var b=function(f,e){f.setChildrenShrunken(e);
return !e
};
var c=new mindplot.commands.GenericFunctionCommand(b,a,d);
this.execute(c,false)
},addFeatureToTopic:function(c,b,a){var d=new mindplot.commands.AddFeatureToTopicCommand(c,b,a);
this.execute(d)
},changeFeatureToTopic:function(b,d,a){var c=new mindplot.commands.ChangeFeatureToTopicCommand(b,d,a);
this.execute(c)
},removeFeatureFromTopic:function(a,c){var b=new mindplot.commands.RemoveFeatureFromTopicCommand(a,c);
this.execute(b)
},execute:function(a){this._actionRunner.execute(a)
}});
mindplot.CommandContext=new Class({initialize:function(a){$assert(a,"designer can not be null");
this._designer=a
},findTopics:function(b){$assert($defined(b),"topicsIds can not be null");
if(!(b instanceof Array)){b=[b]
}var d=this._designer.getModel().getTopics();
var a=d.filter(function(e){return b.contains(e.getId())
});
if(a.length!=b.length){var c=d.map(function(e){return e.getId()
});
$assert(a.length==b.length,"Could not find topic. Result:"+a+", Filter Criteria:"+b+", Current Topics: ["+c+"]")
}return a
},deleteTopic:function(a){this._designer.removeTopic(a)
},createTopic:function(a){$assert(a,"model can not be null");
return this._designer.nodeModelToNodeGraph(a)
},createModel:function(){var a=this._designer.getMindmap();
return a.createNode(mindplot.NodeModel.MAIN_TOPIC_TYPE)
},addTopic:function(b){var a=this._designer.getMindmap();
return a.addBranch(b.getModel())
},connect:function(b,a){b.connectTo(a,this._designer._workspace)
},disconnect:function(a){a.disconnect(this._designer._workspace)
},addRelationship:function(a){$assert(a,"model cannot be null");
return this._designer.addRelationship(a)
},deleteRelationship:function(a){this._designer.deleteRelationship(a)
},findRelationships:function(b){$assert($defined(b),"relId can not be null");
if(!(b instanceof Array)){b=[b]
}var a=this._designer.getModel().getRelationships();
return a.filter(function(c){return b.contains(c.getId())
})
},moveTopic:function(b,a){$assert(b,"topic cannot be null");
$assert(a,"position cannot be null");
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeMoveEvent,{node:b.getModel(),position:a})
}});mindplot.DesignerModel=new Class({Implements:[mindplot.Events],initialize:function(a){this._zoom=a.zoom;
this._topics=[];
this._relationships=[]
},getZoom:function(){return this._zoom
},setZoom:function(a){this._zoom=a
},getTopics:function(){return this._topics
},getRelationships:function(){return this._relationships
},getCentralTopic:function(){var a=this.getTopics();
return a[0]
},filterSelectedTopics:function(){var a=[];
for(var b=0;
b<this._topics.length;
b++){if(this._topics[b].isOnFocus()){a.push(this._topics[b])
}}return a
},filterSelectedRelationships:function(){var a=[];
for(var b=0;
b<this._relationships.length;
b++){if(this._relationships[b].isOnFocus()){a.push(this._relationships[b])
}}return a
},getEntities:function(){var a=[].append(this._topics);
a.append(this._relationships);
return a
},removeTopic:function(a){$assert(a,"topic can not be null");
this._topics.erase(a)
},removeRelationship:function(a){$assert(a,"rel can not be null");
this._relationships.erase(a)
},addTopic:function(a){$assert(a,"topic can not be null");
$assert(typeof a.getId()=="number","id is not a number:"+a.getId());
this._topics.push(a)
},addRelationship:function(a){$assert(a,"rel can not be null");
this._relationships.push(a)
},filterTopicsIds:function(f,c){var a=[];
var g=this.filterSelectedTopics();
var e=true;
for(var b=0;
b<g.length;
b++){var d=g[b];
if($defined(f)){e=f(d)
}if(e){a.push(d.getId())
}else{$notify(c)
}}return a
},selectedTopic:function(){var a=this.filterSelectedTopics();
return(a.length>0)?a[0]:null
},findTopicById:function(d){var a=null;
for(var c=0;
c<this._topics.length;
c++){var b=this._topics[c];
if(b.getId()==d){a=b;
break
}}return a
}});mindplot.Designer=new Class({Extends:mindplot.Events,initialize:function(b,a){$assert(b,"options must be defined");
$assert(b.zoom,"zoom must be defined");
$assert(b.size,"size must be defined");
$assert(a,"divElement must be defined");
mindplot.Messages.init(b.locale);
this._options=b;
a.css(b.size);
var c=new mindplot.CommandContext(this);
this._actionDispatcher=new mindplot.StandaloneActionDispatcher(c);
var e=this;
this._actionDispatcher.addEvent("modelUpdate",function(f){e.fireEvent("modelUpdate",f)
});
mindplot.ActionDispatcher.setInstance(this._actionDispatcher);
this._model=new mindplot.DesignerModel(b);
var d=new mindplot.ScreenManager(a);
this._workspace=new mindplot.Workspace(d,this._model.getZoom());
this._eventBussDispatcher=new mindplot.layout.EventBusDispatcher(this.getModel());
if(!this.isReadOnly()){this._registerMouseEvents();
mindplot.DesignerKeyboard.register(this);
this._dragManager=this._buildDragManager(this._workspace)
}this._registerWheelEvents();
this._relPivot=new mindplot.RelationshipPivot(this._workspace,this);
this.setViewPort(b.viewPort);
mindplot.TopicEventDispatcher.configure(this.isReadOnly());
this._clipboard=[]
},_registerWheelEvents:function(){var b=1.006;
var a=this;
$(document).on("mousewheel",function(c){if(c.deltaY>0){a.zoomIn(b)
}else{a.zoomOut(b)
}c.preventDefault()
})
},addEvent:function(b,c){if(b==mindplot.TopicEvent.EDIT||b==mindplot.TopicEvent.CLICK){var a=mindplot.TopicEventDispatcher.getInstance();
a.addEvent(b,c)
}else{this.parent(b,c)
}},_registerMouseEvents:function(){var b=this._workspace;
var d=b.getScreenManager();
var c=this;
d.addEvent("update",function(){var e=c.getModel().getTopics();
_.each(e,function(f){f.closeEditors()
});
if(c._cleanScreen){c._cleanScreen()
}});
d.addEvent("click",function(e){c.onObjectFocusEvent(null,e)
});
d.addEvent("dblclick",function(g){if(b.isWorkspaceEventsEnabled()){var e=d.getWorkspaceMousePosition(g);
var h=c.getModel().getCentralTopic();
var f=c._createChildModel(h,e);
this._actionDispatcher.addTopics([f],[h.getId()])
}}.bind(this));
function a(e){e.stopPropagation();
e.preventDefault()
}},_buildDragManager:function(c){var b=this.getModel();
var a=new mindplot.DragConnector(b,this._workspace);
var d=new mindplot.DragManager(c,this._eventBussDispatcher);
var e=b.getTopics();
d.addEvent("startdragging",function(){for(var f=0;
f<e.length;
f++){e[f].setMouseEventsEnabled(false)
}});
d.addEvent("dragging",function(g,f){f.updateFreeLayout(g);
if(!f.isFreeLayoutOn(g)){a.checkConnection(f);
if(!f.isVisible()&&f.isConnected()){f.setVisibility(true)
}}});
d.addEvent("enddragging",function(h,g){for(var f=0;
f<e.length;
f++){e[f].setMouseEventsEnabled(true)
}g.applyChanges(c)
});
return d
},setViewPort:function(b){this._workspace.setViewPort(b);
var a=this.getModel();
this._workspace.setZoom(a.getZoom(),true)
},_buildNodeGraph:function(e,j){var f=mindplot.NodeGraph.create(e,{readOnly:j});
this.getModel().addTopic(f);
var h=this;
if(!j){f.addEvent("mousedown",function(i){h.onObjectFocusEvent(f,i)
});
if(f.getType()!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){this._dragManager.add(f)
}}var d=e.isConnected();
if(d){var g=e.getParent();
var b=null;
var a=this.getModel().getTopics();
for(var c=0;
c<a.length;
c++){var k=a[c];
if(k.getModel()==g){b=k;
e.disconnect();
break
}}$assert(b,"Could not find a topic to connect");
f.connectTo(b,this._workspace)
}f.addEvent("ontblur",function(){var l=h.getModel().filterSelectedTopics();
var i=h.getModel().filterSelectedRelationships();
if(l.length==0||i.length==0){h.fireEvent("onblur")
}});
f.addEvent("ontfocus",function(){var l=h.getModel().filterSelectedTopics();
var i=h.getModel().filterSelectedRelationships();
if(l.length==1||i.length==1){h.fireEvent("onfocus")
}});
return f
},onObjectFocusEvent:function(a,c){var e=this.getModel().getTopics();
_.each(e,function(f){f.closeEditors()
});
var b=this.getModel();
var d=b.getEntities();
_.each(d,function(f){if(!$defined(c)||(!c.ctrlKey&&!c.metaKey)){if(f.isOnFocus()&&f!=a){f.setOnFocus(false)
}}})
},selectAll:function(){var a=this.getModel();
var b=a.getEntities();
_.each(b,function(c){c.setOnFocus(true)
})
},deselectAll:function(){var a=this.getModel().getEntities();
_.each(a,function(b){b.setOnFocus(false)
})
},setZoom:function(a){if(a>1.9||a<0.3){$notify($msg("ZOOM_IN_ERROR"));
return
}this.getModel().setZoom(a);
this._workspace.setZoom(a)
},zoomOut:function(b){if(!b){b=1.2
}var a=this.getModel();
var c=a.getZoom()*b;
if(c<=1.9){a.setZoom(c);
this._workspace.setZoom(c)
}else{$notify($msg("ZOOM_ERROR"))
}},zoomIn:function(b){if(!b){b=1.2
}var a=this.getModel();
var c=a.getZoom()/b;
if(c>=0.3){a.setZoom(c);
this._workspace.setZoom(c)
}else{$notify($msg("ZOOM_ERROR"))
}},copyToClipboard:function(){var a=this.getModel().filterSelectedTopics();
if(a.length<=0){$notify($msg("AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED"));
return
}a=a.filter(function(b){return !b.isCentralTopic()
});
this._clipboard=a.map(function(b){var d=b.getModel().deepCopy();
var c=d.getPosition();
d.setPosition(c.x+(60*Math.sign(c.x)),c.y+30);
return d
});
$notify($msg("SELECTION_COPIED_TO_CLIPBOARD"))
},pasteClipboard:function(){if(this._clipboard.length==0){$notify($msg("CLIPBOARD_IS_EMPTY"));
return
}this._actionDispatcher.addTopics(this._clipboard);
this._clipboard=[]
},getModel:function(){return this._model
},shrinkSelectedBranch:function(){var a=this.getModel().filterSelectedTopics();
if(a.length<=0||a.length!=1){$notify($msg("ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE"));
return
}var b=a[0];
if(b.getType()!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){this._actionDispatcher.shrinkBranch([b.getId()],!b.areChildrenShrunken())
}},createChildForSelectedNode:function(){var b=this.getModel().filterSelectedTopics();
if(b.length<=0){$notify($msg("ONE_TOPIC_MUST_BE_SELECTED"));
return
}if(b.length!=1){$notify($msg("ONLY_ONE_TOPIC_MUST_BE_SELECTED"));
return
}var c=b[0];
var a=c.getId();
var d=this._createChildModel(c);
this._actionDispatcher.addTopics([d],[a])
},_copyNodeProps:function(d,a){if(d.getType()!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){var j=d.getFontSize();
if(j){a.setFontSize(j)
}}var g=d.getFontFamily();
if(g){a.setFontFamily(g)
}var f=d.getFontColor();
if(f){a.setFontColor(f)
}var h=d.getFontWeight();
if(h){a.setFontWeight(h)
}var c=d.getFontStyle();
if(c){a.setFontStyle(c)
}var e=d.getShapeType();
if(e){a.setShapeType(e)
}var b=d.getBorderColor();
if(b){a.setBorderColor(b)
}var i=d.getBackgroundColor();
if(i){a.setBackgroundColor(i)
}},_createChildModel:function(g,c){var f=g.getModel();
var e=f.getMindmap();
var h=e.createNode();
var d=this._eventBussDispatcher.getLayoutManager();
var b=d.predict(g.getId(),null,c);
h.setOrder(b.order);
var a=b.position;
h.setPosition(a.x,a.y);
this._copyNodeProps(f,h);
return h
},addDraggedNode:function(c,b){$assert(c,"event can not be null");
$assert(b,"model can not be null");
b.setPosition(1000,1000);
this._actionDispatcher.addTopics([b]);
var a=this.getModel().findTopicById(b.getId());
a.fireEvent("mousedown",c)
},createSiblingForSelectedNode:function(){var b=this.getModel().filterSelectedTopics();
if(b.length<=0){$notify($msg("ONE_TOPIC_MUST_BE_SELECTED"));
return
}if(b.length>1){$notify($msg("ONLY_ONE_TOPIC_MUST_BE_SELECTED"));
return
}var d=b[0];
if(!d.getOutgoingConnectedTopic()){this.createChildForSelectedNode()
}else{var c=d.getOutgoingConnectedTopic();
var e=this._createSiblingModel(d);
if(c.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){e.setOrder(d.getOrder()+2)
}var a=c.getId();
this._actionDispatcher.addTopics([e],[a])
}},_createSiblingModel:function(f){var b=null;
var e=f.getOutgoingConnectedTopic();
if(e!=null){var d=f.getModel();
var c=d.getMindmap();
b=c.createNode();
var a=f.getOrder()+1;
b.setOrder(a);
b.setPosition(10,10)
}this._copyNodeProps(d,b);
return b
},showRelPivot:function(c){var b=this.getModel().filterSelectedTopics();
if(b.length<=0){$notify($msg("RELATIONSHIP_COULD_NOT_BE_CREATED"));
return
}var a=this._workspace.getScreenManager();
var d=a.getWorkspaceMousePosition(c);
this._relPivot.start(b[0],d)
},getMindmapProperties:function(){var a=this.getModel();
return{zoom:a.getZoom()}
},loadMap:function(b){$assert(b,"mindmapModel can not be null");
this._mindmap=b;
var m={width:25,height:25};
var d=new mindplot.layout.LayoutManager(b.getCentralTopic().getId(),m);
var k=this;
d.addEvent("change",function(j){var n=j.getId();
var i=k.getModel().findTopicById(n);
i.setPosition(j.getPosition());
i.setOrder(j.getOrder())
});
this._eventBussDispatcher.setLayoutManager(d);
var l=b.getBranches();
for(var f=0;
f<l.length;
f++){var c=l[f];
var h=this.nodeModelToNodeGraph(c);
h.setBranchVisibility(true)
}var g=b.getRelationships();
for(var e=0;
e<g.length;
e++){this._relationshipModelToRelationship(g[e])
}var a=this.getModel().getCentralTopic();
this.goToNode(a);
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout);
this.fireEvent("loadSuccess")
},getMindmap:function(){return this._mindmap
},undo:function(){this._actionDispatcher._actionRunner.undo()
},redo:function(){this._actionDispatcher._actionRunner.redo()
},isReadOnly:function(){return this._options.readOnly
},nodeModelToNodeGraph:function(e){$assert(e,"Node model can not be null");
var c=e.getChildren().slice();
c=c.sort(function(g,f){return g.getOrder()-f.getOrder()
});
var a=this._buildNodeGraph(e,this.isReadOnly());
a.setVisibility(false);
this._workspace.append(a);
for(var b=0;
b<c.length;
b++){var d=c[b];
if($defined(d)){this.nodeModelToNodeGraph(d)
}}return a
},_relationshipModelToRelationship:function(d){$assert(d,"Node model can not be null");
var b=this._buildRelationshipShape(d);
var a=b.getSourceTopic();
a.addRelationship(b);
var c=b.getTargetTopic();
c.addRelationship(b);
b.setVisibility(a.isVisible()&&c.isVisible());
this._workspace.append(b);
return b
},addRelationship:function(b){var a=this.getMindmap();
a.addRelationship(b);
return this._relationshipModelToRelationship(b)
},deleteRelationship:function(b){var a=b.getSourceTopic();
a.deleteRelationship(b);
var d=b.getTargetTopic();
d.deleteRelationship(b);
this.getModel().removeRelationship(b);
this._workspace.removeChild(b);
var c=this.getMindmap();
c.deleteRelationship(b.getModel())
},_buildRelationshipShape:function(d){var g=this.getModel();
var f=d.getFromNode();
var b=g.findTopicById(f);
var e=d.getToNode();
var c=g.findTopicById(e);
$assert(c,"targetTopic could not be found:"+e+g.getTopics().map(function(i){return i.getId()
}));
var a=new mindplot.Relationship(b,c,d);
var h=this;
a.addEvent("ontblur",function(){var j=h.getModel().filterSelectedTopics();
var i=h.getModel().filterSelectedRelationships();
if(j.length==0||i.length==0){h.fireEvent("onblur")
}});
a.addEvent("ontfocus",function(){var j=h.getModel().filterSelectedTopics();
var i=h.getModel().filterSelectedRelationships();
if(j.length==1||i.length==1){h.fireEvent("onfocus")
}});
g.addRelationship(a);
return a
},removeTopic:function(c){if(!c.isCentralTopic()){var b=c._parent;
c.disconnect(this._workspace);
while(c.getChildren().length>0){this.removeTopic(c.getChildren()[0])
}this._workspace.removeChild(c);
this.getModel().removeTopic(c);
var a=c.getModel();
a.deleteNode();
if($defined(b)){this.goToNode(b)
}}},_resetEdition:function(){var a=this._workspace.getScreenManager();
a.fireEvent("update");
a.fireEvent("mouseup");
this._relPivot.dispose()
},deleteSelectedEntities:function(){this._resetEdition();
var d=this.getModel().filterSelectedTopics();
var b=this.getModel().filterSelectedRelationships();
if(d.length<=0&&b.length<=0){$notify($msg("ENTITIES_COULD_NOT_BE_DELETED"));
return
}else{if(d.length==1&&d[0].isCentralTopic()){$notify($msg("CENTRAL_TOPIC_CAN_NOT_BE_DELETED"));
return
}}var c=d.filter(function(e){return !e.isCentralTopic()
}).map(function(e){return e.getId()
});
var a=b.map(function(e){return e.getId()
});
if(c.length>0||a.length>0){this._actionDispatcher.deleteEntities(c,a)
}},changeFontFamily:function(b){var a=this.getModel().filterTopicsIds();
if(a.length>0){this._actionDispatcher.changeFontFamilyToTopic(a,b)
}},changeFontStyle:function(){var a=this.getModel().filterTopicsIds();
if(a.length>0){this._actionDispatcher.changeFontStyleToTopic(a)
}},changeFontColor:function(b){$assert(b,"color can not be null");
var a=this.getModel().filterTopicsIds();
if(a.length>0){this._actionDispatcher.changeFontColorToTopic(a,b)
}},changeBackgroundColor:function(c){var d=function(e){return e.getShapeType()!=mindplot.model.TopicShape.LINE
};
var a="Color can not be set to line topics.";
var b=this.getModel().filterTopicsIds(d,a);
if(b.length>0){this._actionDispatcher.changeBackgroundColorToTopic(b,c)
}},changeBorderColor:function(c){var d=function(e){return e.getShapeType()!=mindplot.model.TopicShape.LINE
};
var a="Color can not be set to line topics.";
var b=this.getModel().filterTopicsIds(d,a);
if(b.length>0){this._actionDispatcher.changeBorderColorToTopic(b,c)
}},changeFontSize:function(b){var a=this.getModel().filterTopicsIds();
if(a.length>0){this._actionDispatcher.changeFontSizeToTopic(a,b)
}},changeTopicShape:function(c){var d=function(e){return !(e.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE&&c==mindplot.model.TopicShape.LINE)
};
var a="Central Topic shape can not be changed to line figure.";
var b=this.getModel().filterTopicsIds(d,a);
if(b.length>0){this._actionDispatcher.changeShapeTypeToTopic(b,c)
}},changeFontWeight:function(){var a=this.getModel().filterTopicsIds();
if(a.length>0){this._actionDispatcher.changeFontWeightToTopic(a)
}},addIconType:function(a){var b=this.getModel().filterTopicsIds();
if(b.length>0){this._actionDispatcher.addFeatureToTopic(b[0],mindplot.TopicFeature.Icon.id,{id:a})
}},addLink:function(){var b=this.getModel();
var a=b.selectedTopic();
if(a){a.showLinkEditor();
this.onObjectFocusEvent()
}},addNote:function(){var b=this.getModel();
var a=b.selectedTopic();
if(a){a.showNoteEditor();
this.onObjectFocusEvent()
}},goToNode:function(a){a.setOnFocus(true);
this.onObjectFocusEvent(a)
},getWorkSpace:function(){return this._workspace
}});mindplot.ScreenManager=new Class({initialize:function(a){$assert(a,"can not be null");
this._divContainer=a;
this._padding={x:0,y:0};
this._clickEvents=[];
this._divContainer.bind("click",function(b){b.stopPropagation()
});
this._divContainer.bind("dblclick",function(b){b.stopPropagation();
b.preventDefault()
})
},setScale:function(a){$assert(a,"Screen scale can not be null");
this._scale=a
},addEvent:function(a,b){if(a=="click"){this._clickEvents.push(b)
}else{this._divContainer.bind(a,b)
}},removeEvent:function(a,b){if(a=="click"){this._clickEvents.remove(b)
}else{this._divContainer.unbind(a,b)
}},fireEvent:function(a,b){if(a=="click"){_.each(this._clickEvents,function(c){c(a,b)
})
}else{this._divContainer.trigger(a,b)
}},_getElementPosition:function(c){var b=c.getPosition();
var a=b.x;
var d=b.y;
a=a-this._padding.x;
d=d-this._padding.y;
a=a/this._scale;
d=d/this._scale;
return{x:a,y:d}
},getWorkspaceIconPosition:function(j){var c=j.getImage();
var d=c.getPosition();
var k=j.getSize();
var f=j.getGroup();
var o=f.getNativeElement();
var i=o.getCoordOrigin();
var p=o.getSize();
var n=o.getCoordSize();
var b={x:n.width/parseInt(p.width),y:n.height/parseInt(p.height)};
var m=(d.x-i.x-(parseInt(k.width)/2))/b.x;
var l=(d.y-i.y-(parseInt(k.height)/2))/b.y;
var a=f.getPosition();
m=m+a.x;
l=l+a.y;
var h=f.getTopic();
var g=this._getElementPosition(h);
g.x=g.x-(parseInt(h.getSize().width)/2);
return{x:m+g.x,y:l+g.y}
},getWorkspaceMousePosition:function(b){var a=b.clientX;
var c=b.clientY;
a=a*this._scale;
c=c*this._scale;
a=a+this._padding.x;
c=c+this._padding.y;
return new core.Point(a,c)
},getContainer:function(){return this._divContainer
},setOffset:function(a,b){this._padding.x=a;
this._padding.y=b
}});mindplot.Workspace=new Class({initialize:function(d,c){$assert(d,"Div container can not be null");
$assert(c,"zoom container can not be null");
this._zoom=c;
this._screenManager=d;
var b=d.getContainer();
this._screenWidth=parseInt(b.css("width"));
this._screenHeight=parseInt(b.css("height"));
var a=this._createWorkspace();
this._workspace=a;
a.addItAsChildTo(b);
this.setZoom(c,true);
this._registerDragEvents();
this._eventsEnabled=true
},_createWorkspace:function(){var c=-(this._screenWidth/2);
var b=-(this._screenHeight/2);
var a={width:this._screenWidth+"px",height:this._screenHeight+"px",coordSizeWidth:this._screenWidth,coordSizeHeight:this._screenHeight,coordOriginX:c,coordOriginY:b,fillColor:"transparent",strokeWidth:0};
web2d.peer.Toolkit.init();
return new web2d.Workspace(a)
},append:function(a){if($defined(a.addToWorkspace)){a.addToWorkspace(this)
}else{this._workspace.append(a)
}},removeChild:function(a){if($defined(a.removeFromWorkspace)){a.removeFromWorkspace(this)
}else{this._workspace.removeChild(a)
}},addEvent:function(a,b){this._workspace.addEvent(a,b)
},removeEvent:function(a,b){$assert(a,"type can not be null");
$assert(b,"listener can not be null");
this._workspace.removeEvent(a,b)
},getSize:function(){return this._workspace.getCoordSize()
},setZoom:function(g,a){this._zoom=g;
var d=this._workspace;
var c=g*this._screenWidth;
var h=g*this._screenHeight;
d.setCoordSize(c,h);
if(this._viewPort){this._viewPort.width=this._viewPort.width*g;
this._viewPort.height=this._viewPort.height*g
}var f;
var e;
if(a){if(this._viewPort){f=-(this._viewPort.width/2);
e=-(this._viewPort.height/2)
}else{f=-(c/2);
e=-(h/2)
}}else{var b=d.getCoordOrigin();
f=b.x;
e=b.y
}d.setCoordOrigin(f,e);
this._screenManager.setOffset(f,e);
this._screenManager.setScale(g);
this._screenManager.fireEvent("update")
},getScreenManager:function(){return this._screenManager
},enableWorkspaceEvents:function(a){this._eventsEnabled=a
},isWorkspaceEventsEnabled:function(){return this._eventsEnabled
},dumpNativeChart:function(){return this._workspace.dumpNativeChart()
},_registerDragEvents:function(){var b=this._workspace;
var d=this._screenManager;
var c=this;
var a=function(g){if(!$defined(b._mouseMoveListener)){if(c.isWorkspaceEventsEnabled()){c.enableWorkspaceEvents(false);
var f=d.getWorkspaceMousePosition(g);
var e=b.getCoordOrigin();
var h=false;
b._mouseMoveListener=function(l){var n=d.getWorkspaceMousePosition(l);
var i=n.x-f.x;
var k=-i+e.x;
var m=n.y-f.y;
var j=-m+e.y;
b.setCoordOrigin(k,j);
if(Browser.firefox){window.document.body.style.cursor="-moz-grabbing"
}else{window.document.body.style.cursor="move"
}l.preventDefault();
d.fireEvent("update");
h=true
};
d.addEvent("mousemove",b._mouseMoveListener);
b._mouseUpListener=function(j){d.removeEvent("mousemove",b._mouseMoveListener);
d.removeEvent("mouseup",b._mouseUpListener);
b._mouseUpListener=null;
b._mouseMoveListener=null;
window.document.body.style.cursor="default";
var i=b.getCoordOrigin();
d.setOffset(i.x,i.y);
c.enableWorkspaceEvents(true);
if(!h){d.fireEvent("click")
}};
d.addEvent("mouseup",b._mouseUpListener)
}}else{b._mouseUpListener()
}};
d.addEvent("mousedown",a)
},setViewPort:function(a){this._viewPort=a
}});mindplot.ShirinkConnector=new Class({initialize:function(b){var d=new web2d.Elipse(mindplot.Topic.prototype.INNER_RECT_ATTRIBUTES);
this._ellipse=d;
d.setFill("rgb(62,118,179)");
d.setSize(mindplot.Topic.CONNECTOR_WIDTH,mindplot.Topic.CONNECTOR_WIDTH);
d.addEvent("click",function(g){var e=b.getModel();
var i=!e.areChildrenShrunken();
var f=b.getId();
var h=mindplot.ActionDispatcher.getInstance();
h.shrinkBranch([f],i);
g.stopPropagation()
});
d.addEvent("mousedown",function(e){e.stopPropagation()
});
d.addEvent("dblclick",function(e){e.stopPropagation()
});
d.addEvent("mouseover",function(e){d.setFill("rgb(153, 0, 255)")
});
var c=this;
d.addEvent("mouseout",function(f){var e=b.getBackgroundColor();
c.setFill(e)
});
d.setCursor("default");
this._fillColor="#f7f7f7";
var a=b.getModel();
this.changeRender(a.areChildrenShrunken())
},changeRender:function(a){var b=this._ellipse;
if(a){b.setStroke("2","solid")
}else{b.setStroke("1","solid")
}},setVisibility:function(a){this._ellipse.setVisibility(a)
},setOpacity:function(a){this._ellipse.setOpacity(a)
},setFill:function(a){this._fillColor=a;
this._ellipse.setFill(a)
},setAttribute:function(a,b){this._ellipse.setAttribute(a,b)
},addToWorkspace:function(a){a.append(this._ellipse)
},setPosition:function(a,b){this._ellipse.setPosition(a,b)
},moveToBack:function(){this._ellipse.moveToBack()
},moveToFront:function(){this._ellipse.moveToFront()
}});mindplot.Keyboard=new Class({initialize:function(){},addShortcut:function(a,b){if(!$.isArray(a)){a=[a]
}_.each(a,function(c){$(document).bind("keydown",c,b)
})
}});mindplot.DesignerKeyboard=new Class({Extends:mindplot.Keyboard,Static:{register:function(a){this._instance=new mindplot.DesignerKeyboard(a)
},getInstance:function(){return this._instance
}},initialize:function(a){$assert(a,"designer can not be null");
this._registerEvents(a)
},_registerEvents:function(b){var a=b.getModel();
this.addShortcut(["backspace"],function(e){e.preventDefault();
e.stopPropagation();
b.deleteSelectedEntities()
});
this.addShortcut(["space"],function(){b.shrinkSelectedBranch()
});
this.addShortcut(["f2"],function(f){f.stopPropagation();
f.preventDefault();
var e=a.selectedTopic();
if(e){e.showTextEditor()
}});
this.addShortcut(["del"],function(e){b.deleteSelectedEntities();
e.preventDefault();
e.stopPropagation()
});
this.addShortcut(["enter"],function(){b.createSiblingForSelectedNode()
});
this.addShortcut(["insert"],function(e){b.createChildForSelectedNode();
e.preventDefault();
e.stopPropagation()
});
this.addShortcut(["tab"],function(e){b.createChildForSelectedNode();
e.preventDefault();
e.stopPropagation()
});
this.addShortcut(["meta+enter"],function(e){e.preventDefault();
e.stopPropagation();
b.createChildForSelectedNode()
});
this.addShortcut(["ctrl+z","meta+z"],function(e){e.preventDefault(e);
e.stopPropagation();
b.undo()
});
this.addShortcut(["ctrl+c","meta+c"],function(e){e.preventDefault(e);
e.stopPropagation();
b.copyToClipboard()
});
this.addShortcut(["ctrl+v","meta+v"],function(e){e.preventDefault(e);
e.stopPropagation();
b.pasteClipboard()
});
this.addShortcut(["ctrl+shift+z","meta+shift+z","ctrl+y","meta+y"],function(e){e.preventDefault();
e.stopPropagation();
b.redo()
});
this.addShortcut(["ctrl+a","meta+a"],function(e){e.preventDefault();
e.stopPropagation();
b.selectAll()
});
this.addShortcut(["ctrl+b","meta+b"],function(e){e.preventDefault();
e.stopPropagation();
b.changeFontWeight()
});
this.addShortcut(["ctrl+s","meta+s"],function(e){e.preventDefault();
e.stopPropagation();
$(document).find("#save").trigger("click")
});
this.addShortcut(["ctrl+i","meta+i"],function(e){e.preventDefault();
e.stopPropagation();
b.changeFontStyle()
});
this.addShortcut(["ctrl+shift+a","meta+shift+a"],function(e){e.preventDefault();
e.stopPropagation();
b.deselectAll()
});
this.addShortcut(["meta+=","ctrl+="],function(e){e.preventDefault();
e.stopPropagation();
b.zoomIn()
});
this.addShortcut(["meta+-","ctrl+-"],function(e){e.preventDefault();
e.stopPropagation();
b.zoomOut()
});
var c=this;
this.addShortcut("right",function(f){var e=a.selectedTopic();
if(e){if(e.isCentralTopic()){c._goToSideChild(b,e,"RIGHT")
}else{if(e.getPosition().x<0){c._goToParent(b,e)
}else{if(!e.areChildrenShrunken()){c._goToChild(b,e)
}}}}else{var g=a.getCentralTopic();
c._goToNode(b,g)
}f.preventDefault();
f.stopPropagation()
});
this.addShortcut("left",function(f){var e=a.selectedTopic();
if(e){if(e.isCentralTopic()){c._goToSideChild(b,e,"LEFT")
}else{if(e.getPosition().x>0){c._goToParent(b,e)
}else{if(!e.areChildrenShrunken()){c._goToChild(b,e)
}}}}else{var g=a.getCentralTopic();
c._goToNode(b,g)
}f.preventDefault();
f.stopPropagation()
});
this.addShortcut("up",function(f){var e=a.selectedTopic();
if(e){if(!e.isCentralTopic()){c._goToBrother(b,e,"UP")
}}else{var g=a.getCentralTopic();
c._goToNode(b,g)
}f.preventDefault();
f.stopPropagation()
});
this.addShortcut("down",function(f){var e=a.selectedTopic();
if(e){if(!e.isCentralTopic()){c._goToBrother(b,e,"DOWN")
}}else{var g=a.getCentralTopic();
c._goToNode(b,g)
}f.preventDefault();
f.stopPropagation()
});
var d=["esc","escape","f1","f3","f4","f5","f6","f7","f8","f9","f10","f11","f12"];
$(document).on("keypress",function(f){var h;
if(f.key&&d.contains(f.key.toLowerCase())){return
}if(f.key&&f.keyCode==0){h=f.charCode
}else{h=f.keyCode
}var g=jQuery.hotkeys.specialKeys[h];
if(["enter","capslock"].indexOf(g)==-1&&!jQuery.hotkeys.shiftNums[h]){var e=b.getModel().filterSelectedTopics();
if(e.length>0){var i=String.fromCharCode(h);
if(f.ctrlKey||f.altKey||f.metaKey){return
}e[0].showTextEditor(i);
f.stopPropagation()
}}})
},_goToBrother:function(p,c,l){var n=c.getParent();
if(n){var e=n.getChildren();
var h=c;
var k=c.getPosition().y;
var m=c.getPosition().x;
var j=null;
for(var d=0;
d<e.length;
d++){var f=(m*e[d].getPosition().x)>=0;
if(e[d]!=c&&f){var o=e[d];
var g=o.getPosition().y;
if(l=="DOWN"&&g>k){var b=k-g;
if(b<0){b=b*(-1)
}if(j==null||j>b){j=b;
h=e[d]
}}else{if(l=="UP"&&g<k){var a=k-g;
if(a<0){a=a*(-1)
}if(j==null||j>a){j=a;
h=e[d]
}}}}}this._goToNode(p,h)
}},_goToSideChild:function(j,c,f){var b=c.getChildren();
if(b.length>0){var e=b[0];
var g=null;
for(var d=0;
d<b.length;
d++){var a=b[d];
var h=a.getPosition().y;
if(f=="LEFT"&&a.getPosition().x<0){if(g==null||h<g){e=a;
g=h
}}if(f=="RIGHT"&&a.getPosition().x>0){if(g==null||h<g){e=a;
g=h
}}}this._goToNode(j,e)
}},_goToParent:function(a,c){var b=c.getParent();
if(b){this._goToNode(a,b)
}},_goToChild:function(c,d){var b=d.getChildren();
if(b.length>0){var f=b[0];
var e=f.getPosition().y;
for(var a=0;
a<b.length;
a++){var g=b[a];
if(g.getPosition().y<e){e=g.getPosition().y;
f=g
}}this._goToNode(c,f)
}},_goToNode:function(a,b){a.deselectAll();
b.setOnFocus(true)
}});
mindplot.DesignerKeyboard.specialKeys={8:"backspace",9:"tab",10:"return",13:"enter",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",186:";",191:"/",220:"\\",222:"'",224:"meta"};mindplot.TopicStyle=new Class({Static:{_getStyles:function(c){$assert(c,"topic can not be null");
var a;
if(c.isCentralTopic()){a=mindplot.TopicStyle.STYLES.CENTRAL_TOPIC
}else{var b=c.getOutgoingConnectedTopic();
if($defined(b)){if(b.isCentralTopic()){a=mindplot.TopicStyle.STYLES.MAIN_TOPIC
}else{a=mindplot.TopicStyle.STYLES.SUB_TOPIC
}}else{a=mindplot.TopicStyle.STYLES.ISOLATED_TOPIC
}}return a
},defaultText:function(a){var b=this._getStyles(a).msgKey;
return $msg(b)
},defaultFontStyle:function(a){return this._getStyles(a).fontStyle
},defaultBackgroundColor:function(a){return this._getStyles(a).backgroundColor
},defaultBorderColor:function(a){return this._getStyles(a).borderColor
},getInnerPadding:function(a){return this._getStyles(a).innerPadding
},defaultShapeType:function(a){return this._getStyles(a).shapeType
}}});
mindplot.TopicStyle.STYLES={CENTRAL_TOPIC:{borderColor:"rgb(57,113,177)",backgroundColor:"rgb(80,157,192)",fontStyle:{font:"Verdana",size:10,style:"normal",weight:"bold",color:"#ffffff"},msgKey:"CENTRAL_TOPIC",innerPadding:11,shapeType:mindplot.model.TopicShape.ROUNDED_RECT},MAIN_TOPIC:{borderColor:"rgb(2,59,185)",backgroundColor:"rgb(224,229,239)",fontStyle:{font:"Arial",size:8,style:"normal",weight:"normal",color:"rgb(82,92,97)"},msgKey:"MAIN_TOPIC",innerPadding:3,shapeType:mindplot.model.TopicShape.LINE},SUB_TOPIC:{borderColor:"rgb(2,59,185)",backgroundColor:"rgb(224,229,239)",fontStyle:{font:"Arial",size:6,style:"normal",weight:"normal",color:"rgb(82,92,97)"},msgKey:"SUB_TOPIC",innerPadding:3,shapeType:mindplot.model.TopicShape.LINE},ISOLATED_TOPIC:{borderColor:"rgb(2,59,185)",backgroundColor:"rgb(224,229,239)",fontStyle:{font:"Verdana",size:8,style:"normal",weight:"normal",color:"rgb(82,92,97)"},msgKey:"ISOLATED_TOPIC",innerPadding:4,shapeType:mindplot.model.TopicShape.LINE}};mindplot.NodeGraph=new Class({initialize:function(b,a){$assert(b,"model can not be null");
this._options=a;
this._mouseEvents=true;
this.setModel(b);
this._onFocus=false;
this._size={width:50,height:20}
},isReadOnly:function(){return this._options.readOnly
},getType:function(){var a=this.getModel();
return a.getType()
},setId:function(a){$assert(typeof topic.getId()=="number","id is not a number:"+a);
this.getModel().setId(a)
},_set2DElement:function(a){this._elem2d=a
},get2DElement:function(){$assert(this._elem2d,"NodeGraph has not been initialized properly");
return this._elem2d
},setPosition:function(a,b){throw"Unsupported operation"
},addEvent:function(a,c){var b=this.get2DElement();
b.addEvent(a,c)
},removeEvent:function(a,c){var b=this.get2DElement();
b.removeEvent(a,c)
},fireEvent:function(a,c){var b=this.get2DElement();
b.trigger(a,c)
},setMouseEventsEnabled:function(a){this._mouseEvents=a
},isMouseEventsEnabled:function(){return this._mouseEvents
},getSize:function(){return this._size
},setSize:function(a){this._size.width=parseInt(a.width);
this._size.height=parseInt(a.height)
},getModel:function(){$assert(this._model,"Model has not been initialized yet");
return this._model
},setModel:function(a){$assert(a,"Model can not be null");
this._model=a
},getId:function(){return this._model.getId()
},setOnFocus:function(a){if(this._onFocus!=a){this._onFocus=a;
var b=this.getOuterShape();
if(a){b.setFill(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES_FOCUS.fillColor);
b.setOpacity(1)
}else{b.setFill(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES.fillColor);
b.setOpacity(0)
}this.setCursor("move");
this.closeEditors();
this.fireEvent(a?"ontfocus":"ontblur",this)
}},isOnFocus:function(){return this._onFocus
},dispose:function(a){this.setOnFocus(false);
a.removeChild(this)
},createDragNode:function(a){var b=this._buildDragShape();
return new mindplot.DragTopic(b,this,a)
},_buildDragShape:function(){$assert(false,"_buildDragShape must be implemented by all nodes.")
},getPosition:function(){var a=this.getModel();
return a.getPosition()
}});
mindplot.NodeGraph.create=function(d,b){$assert(d,"Model can not be null");
var c=d.getType();
$assert(c,"Node model type can not be null");
var a;
if(c==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){a=new mindplot.CentralTopic(d,b)
}else{if(c==mindplot.model.INodeModel.MAIN_TOPIC_TYPE){a=new mindplot.MainTopic(d,b)
}else{$assert(false,"unsupported node type:"+c)
}}return a
};mindplot.Topic=new Class({Extends:mindplot.NodeGraph,initialize:function(b,a){this.parent(b,a);
this._children=[];
this._parent=null;
this._relationships=[];
this._isInWorkspace=false;
this._buildTopicShape();
var c=b.getPosition();
if(c!=null&&this.isCentralTopic()){this.setPosition(c)
}if(!this.isReadOnly()){this._registerEvents()
}},_registerEvents:function(){this.setMouseEventsEnabled(true);
this.addEvent("click",function(b){b.stopPropagation()
});
var a=this;
this.addEvent("dblclick",function(b){a._getTopicEventDispatcher().show(a);
b.stopPropagation()
})
},setShapeType:function(a){this._setShapeType(a,true)
},getParent:function(){return this._parent
},_setShapeType:function(g,d){var f=this.getModel();
if($defined(d)&&d){f.setShapeType(g)
}var e=this.getInnerShape();
if(e!=null){this._removeInnerShape();
var a=this.getInnerShape();
var j=this.getSize();
this.setSize(j,true);
var h=this.get2DElement();
h.append(a);
var i=this.getTextShape();
i.moveToFront();
var c=this.getIconGroup();
if($defined(c)){c.moveToFront()
}var b=this.getShrinkConnector();
if($defined(b)){b.moveToFront()
}}},getShapeType:function(){var b=this.getModel();
var a=b.getShapeType();
if(!$defined(a)){a=mindplot.TopicStyle.defaultShapeType(this)
}return a
},_removeInnerShape:function(){var b=this.get2DElement();
var a=this.getInnerShape();
b.removeChild(a);
this._innerShape=null;
return a
},getInnerShape:function(){if(!$defined(this._innerShape)){this._innerShape=this._buildShape(mindplot.Topic.INNER_RECT_ATTRIBUTES,this.getShapeType());
var a=this.getBackgroundColor();
this._setBackgroundColor(a,false);
var b=this.getBorderColor();
this._setBorderColor(b,false);
if(!this.isCentralTopic()&&!this.isReadOnly()){this._innerShape.setCursor("move")
}else{this._innerShape.setCursor("default")
}}return this._innerShape
},_buildShape:function(b,f){$assert(b,"attributes can not be null");
$assert(f,"shapeType can not be null");
var a;
if(f==mindplot.model.TopicShape.RECTANGLE){a=new web2d.Rect(0,b)
}else{if(f==mindplot.model.TopicShape.IMAGE){var d=this.getModel();
var c=d.getImageUrl();
var e=d.getImageSize();
a=new web2d.Image();
a.setHref(c);
a.setSize(e.width,e.height);
a.getSize=function(){return d.getImageSize()
};
a.setPosition=function(){}
}else{if(f==mindplot.model.TopicShape.ELLIPSE){a=new web2d.Rect(0.9,b)
}else{if(f==mindplot.model.TopicShape.ROUNDED_RECT){a=new web2d.Rect(0.3,b)
}else{if(f==mindplot.model.TopicShape.LINE){a=new web2d.Line({strokeColor:"#495879",strokeWidth:1});
a.setSize=function(h,g){this.size={width:h,height:g};
a.setFrom(0,g);
a.setTo(h,g);
var i=mindplot.ConnectionLine.getStrokeColor();
a.setStroke(1,"solid",i)
};
a.getSize=function(){return this.size
};
a.setPosition=function(){};
a.setFill=function(){};
a.setStroke=function(){}
}else{$assert(false,"Unsupported figure shapeType:"+f)
}}}}}a.setPosition(0,0);
return a
},setCursor:function(b){var d=this.getInnerShape();
d.setCursor(b);
var a=this.getOuterShape();
a.setCursor(b);
var c=this.getTextShape();
c.setCursor(b)
},getOuterShape:function(){if(!$defined(this._outerShape)){var a=this._buildShape(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES,mindplot.model.TopicShape.ROUNDED_RECT);
a.setPosition(-2,-3);
a.setOpacity(0);
this._outerShape=a
}return this._outerShape
},getTextShape:function(){if(!$defined(this._text)){this._text=this._buildTextShape(false);
var a=this.getText();
this._setText(a,false)
}return this._text
},getOrBuildIconGroup:function(){if(!$defined(this._iconsGroup)){this._iconsGroup=this._buildIconGroup();
var a=this.get2DElement();
a.append(this._iconsGroup.getNativeElement());
this._iconsGroup.moveToFront()
}return this._iconsGroup
},getIconGroup:function(){return this._iconsGroup
},_buildIconGroup:function(){var h=this.getTextShape().getFontHeight();
var a=new mindplot.IconGroup(this.getId(),h);
var f=mindplot.TopicStyle.getInnerPadding(this);
a.setPosition(f,f);
var b=this.getModel();
var e=b.getFeatures();
for(var c=0;
c<e.length;
c++){var g=e[c];
var d=mindplot.TopicFeature.createIcon(this,g,this.isReadOnly());
a.addIcon(d,g.getType()==mindplot.TopicFeature.Icon.id&&!this.isReadOnly())
}return a
},addFeature:function(d){var b=this.getOrBuildIconGroup();
this.closeEditors();
var c=this.getModel();
c.addFeature(d);
var a=mindplot.TopicFeature.createIcon(this,d,this.isReadOnly());
b.addIcon(a,d.getType()==mindplot.TopicFeature.Icon.id&&!this.isReadOnly());
this._adjustShapes();
return a
},findFeatureById:function(b){var a=this.getModel();
return a.findFeatureById(b)
},removeFeature:function(c){$assert(c,"featureModel could not be null");
var b=this.getModel();
b.removeFeature(c);
var a=this.getIconGroup();
if($defined(a)){a.removeIconByModel(c)
}this._adjustShapes()
},addRelationship:function(a){this._relationships.push(a)
},deleteRelationship:function(a){this._relationships.erase(a)
},getRelationships:function(){return this._relationships
},_buildTextShape:function(g){var a=new web2d.Text();
var e=this.getFontFamily();
var c=this.getFontSize();
var f=this.getFontWeight();
var d=this.getFontStyle();
a.setFont(e,c,d,f);
var b=this.getFontColor();
a.setColor(b);
if(!g){if(!this.isCentralTopic()){a.setCursor("move")
}else{a.setCursor("default")
}}return a
},setFontFamily:function(c,d){var b=this.getTextShape();
b.setFontFamily(c);
if($defined(d)&&d){var a=this.getModel();
a.setFontFamily(c)
}this._adjustShapes(d)
},setFontSize:function(c,d){var b=this.getTextShape();
b.setSize(c);
if($defined(d)&&d){var a=this.getModel();
a.setFontSize(c)
}this._adjustShapes(d)
},setFontStyle:function(c,d){var b=this.getTextShape();
b.setStyle(c);
if($defined(d)&&d){var a=this.getModel();
a.setFontStyle(c)
}this._adjustShapes(d)
},setFontWeight:function(c,d){var b=this.getTextShape();
b.setWeight(c);
if($defined(d)&&d){var a=this.getModel();
a.setFontWeight(c)
}this._adjustShapes()
},getFontWeight:function(){var c=this.getModel();
var a=c.getFontWeight();
if(!$defined(a)){var b=mindplot.TopicStyle.defaultFontStyle(this);
a=b.weight
}return a
},getFontFamily:function(){var c=this.getModel();
var a=c.getFontFamily();
if(!$defined(a)){var b=mindplot.TopicStyle.defaultFontStyle(this);
a=b.font
}return a
},getFontColor:function(){var c=this.getModel();
var a=c.getFontColor();
if(!$defined(a)){var b=mindplot.TopicStyle.defaultFontStyle(this);
a=b.color
}return a
},getFontStyle:function(){var c=this.getModel();
var a=c.getFontStyle();
if(!$defined(a)){var b=mindplot.TopicStyle.defaultFontStyle(this);
a=b.style
}return a
},getFontSize:function(){var c=this.getModel();
var a=c.getFontSize();
if(!$defined(a)){var b=mindplot.TopicStyle.defaultFontStyle(this);
a=b.size
}return a
},setFontColor:function(c,d){var b=this.getTextShape();
b.setColor(c);
if($defined(d)&&d){var a=this.getModel();
a.setFontColor(c)
}},_setText:function(d,c){var b=this.getTextShape();
b.setText(d==null?mindplot.TopicStyle.defaultText(this):d);
if($defined(c)&&c){var a=this.getModel();
a.setText(d)
}},setText:function(a){if(!a||$.trim(a).length==0){a=null
}this._setText(a,true);
this._adjustShapes()
},getText:function(){var b=this.getModel();
var a=b.getText();
if(!$defined(a)){a=mindplot.TopicStyle.defaultText(this)
}return a
},setBackgroundColor:function(a){this._setBackgroundColor(a,true)
},_setBackgroundColor:function(b,e){var d=this.getInnerShape();
d.setFill(b);
var a=this.getShrinkConnector();
if(a){a.setFill(b)
}if($defined(e)&&e){var c=this.getModel();
c.setBackgroundColor(b)
}},getBackgroundColor:function(){var b=this.getModel();
var a=b.getBackgroundColor();
if(!$defined(a)){a=mindplot.TopicStyle.defaultBackgroundColor(this)
}return a
},setBorderColor:function(a){this._setBorderColor(a,true)
},_setBorderColor:function(b,e){var d=this.getInnerShape();
d.setAttribute("strokeColor",b);
var a=this.getShrinkConnector();
if(a){a.setAttribute("strokeColor",b)
}if($defined(e)&&e){var c=this.getModel();
c.setBorderColor(b)
}},getBorderColor:function(){var b=this.getModel();
var a=b.getBorderColor();
if(!$defined(a)){a=mindplot.TopicStyle.defaultBorderColor(this)
}return a
},_buildTopicShape:function(){var g={width:100,height:100,coordSizeWidth:100,coordSizeHeight:100};
var f=new web2d.Group(g);
this._set2DElement(f);
var c=this.getOuterShape();
var e=this.getInnerShape();
var d=this.getTextShape();
f.append(c);
f.append(e);
f.append(d);
var b=this.getModel();
if(b.getFeatures().length!=0){this.getOrBuildIconGroup()
}var a=this.getShrinkConnector();
if($defined(a)){a.addToWorkspace(f)
}this._registerDefaultListenersToElement(f,this)
},_registerDefaultListenersToElement:function(d,a){var e=function(f){if(a.isMouseEventsEnabled()){a.handleMouseOver(f)
}};
d.addEvent("mouseover",e);
var c=function(f){if(a.isMouseEventsEnabled()){a.handleMouseOut(f)
}};
d.addEvent("mouseout",c);
var b=this;
d.addEvent("mousedown",function(g){if(!b.isReadOnly()){var h=true;
if((g.metaKey&&Browser.Platform.mac)||(g.ctrlKey&&!Browser.Platform.mac)){h=!b.isOnFocus();
g.stopPropagation();
g.preventDefault()
}a.setOnFocus(h)
}var f=b._getTopicEventDispatcher();
f.process(mindplot.TopicEvent.CLICK,b);
g.stopPropagation()
})
},areChildrenShrunken:function(){var a=this.getModel();
return a.areChildrenShrunken()&&!this.isCentralTopic()
},isCollapsed:function(){var a=false;
var b=this.getParent();
while(b&&!a){a=b.areChildrenShrunken();
b=b.getParent()
}return a
},setChildrenShrunken:function(e){var b=this.getModel();
b.setChildrenShrunken(e);
var a=this.getShrinkConnector();
if($defined(a)){a.changeRender(e)
}var d=this._flatten2DElements(this);
var f=new mindplot.util.FadeEffect(d,!e);
var c=this;
f.addEvent("complete",function(){if(e){c.setOnFocus(true)
}d.forEach(function(g){if(g.setOnFocus){g.setOnFocus(false)
}})
});
f.start();
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeShrinkEvent,b)
},getShrinkConnector:function(){var a=this._connector;
if(this._connector==null){this._connector=new mindplot.ShirinkConnector(this);
this._connector.setVisibility(false);
a=this._connector
}return a
},handleMouseOver:function(){var a=this.getOuterShape();
a.setOpacity(1)
},handleMouseOut:function(){var a=this.getOuterShape();
if(!this.isOnFocus()){a.setOpacity(0)
}},showTextEditor:function(a){this._getTopicEventDispatcher().show(this,{text:a})
},showNoteEditor:function(){var c=this.getId();
var a=this.getModel();
var d={getValue:function(){var f=a.findFeatureByType(mindplot.TopicFeature.Note.id);
var e;
if(f.length>0){e=f[0].getText()
}return e
},setValue:function(g){var f=mindplot.ActionDispatcher.getInstance();
var e=a.findFeatureByType(mindplot.TopicFeature.Note.id);
if(!$defined(g)){var h=e[0].getId();
f.removeFeatureFromTopic(c,h)
}else{if(e.length>0){f.changeFeatureToTopic(c,e[0].getId(),{text:g})
}else{f.addFeatureToTopic(c,mindplot.TopicFeature.Note.id,{text:g})
}}}};
var b=new mindplot.widget.NoteEditor(d);
this.closeEditors();
b.show()
},showLinkEditor:function(){var c=this.getId();
var a=this.getModel();
var d={getValue:function(){var f=a.findFeatureByType(mindplot.TopicFeature.Link.id);
var e;
if(f.length>0){e=f[0].getUrl()
}return e
},setValue:function(g){var f=mindplot.ActionDispatcher.getInstance();
var e=a.findFeatureByType(mindplot.TopicFeature.Link.id);
if(!$defined(g)){var h=e[0].getId();
f.removeFeatureFromTopic(c,h)
}else{if(e.length>0){f.changeFeatureToTopic(c,e[0].getId(),{url:g})
}else{f.addFeatureToTopic(c,mindplot.TopicFeature.Link.id,{url:g})
}}}};
this.closeEditors();
var b=new mindplot.widget.LinkEditor(d);
b.show()
},closeEditors:function(){this._getTopicEventDispatcher().close(true)
},_getTopicEventDispatcher:function(){return mindplot.TopicEventDispatcher.getInstance()
},setPosition:function(b){$assert(b,"position can not be null");
b.x=Math.ceil(b.x);
b.y=Math.ceil(b.y);
var c=this.getModel();
c.setPosition(b.x,b.y);
var d=this.getSize();
var a=b.x-(d.width/2);
var e=b.y-(d.height/2);
this._elem2d.setPosition(a,e);
this._updateConnectionLines();
this.invariant()
},getOutgoingLine:function(){return this._outgoingLine
},getIncomingLines:function(){var a=[];
var d=this.getChildren();
for(var c=0;
c<d.length;
c++){var e=d[c];
var b=e.getOutgoingLine();
if($defined(b)){a.push(b)
}}return a
},getOutgoingConnectedTopic:function(){var a=null;
var b=this.getOutgoingLine();
if($defined(b)){a=b.getTargetTopic()
}return a
},_updateConnectionLines:function(){var c=this.getOutgoingLine();
if($defined(c)){c.redraw()
}var d=this.getIncomingLines();
for(var b=0;
b<d.length;
b++){d[b].redraw()
}for(var a=0;
a<this._relationships.length;
a++){this._relationships[a].redraw()
}},setBranchVisibility:function(b){var c=this;
var a=this;
while(a!=null&&!a.isCentralTopic()){c=a;
a=c.getParent()
}c.setVisibility(b)
},setVisibility:function(b){this._setTopicVisibility(b);
this._setChildrenVisibility(b);
this._setRelationshipLinesVisibility(b);
var a=this.getOutgoingLine();
if(a){a.setVisibility(b)
}},moveToBack:function(){for(var b=0;
b<this._relationships.length;
b++){this._relationships[b].moveToBack()
}var a=this.getShrinkConnector();
if($defined(a)){a.moveToBack()
}this.get2DElement().moveToBack()
},moveToFront:function(){this.get2DElement().moveToFront();
var a=this.getShrinkConnector();
if($defined(a)){a.moveToFront()
}for(var b=0;
b<this._relationships.length;
b++){this._relationships[b].moveToFront()
}},isVisible:function(){var a=this.get2DElement();
return a.isVisible()
},_setRelationshipLinesVisibility:function(a){_.each(this._relationships,function(f){var b=f.getSourceTopic();
var d=f.getTargetTopic();
var e=d.getModel().getParent();
var c=b.getModel().getParent();
f.setVisibility(a&&(e==null||!e.areChildrenShrunken())&&(c==null||!c.areChildrenShrunken()))
})
},_setTopicVisibility:function(d){var c=this.get2DElement();
c.setVisibility(d);
if(this.getIncomingLines().length>0){var a=this.getShrinkConnector();
if($defined(a)){a.setVisibility(d)
}}var b=this.getTextShape();
b.setVisibility(this.getShapeType()!=mindplot.model.TopicShape.IMAGE?d:false)
},setOpacity:function(b){var d=this.get2DElement();
d.setOpacity(b);
var a=this.getShrinkConnector();
if($defined(a)){a.setOpacity(b)
}var c=this.getTextShape();
c.setOpacity(b)
},_setChildrenVisibility:function(a){var d=this.getChildren();
var b=this.getModel();
a=a?!b.areChildrenShrunken():a;
for(var c=0;
c<d.length;
c++){var f=d[c];
f.setVisibility(a);
var e=f.getOutgoingLine();
e.setVisibility(a)
}},invariant:function(){var a=this._outgoingLine;
var b=this.getModel();
var c=b.isConnected();
if((c&&!a)||(!c&&a)){}},setSize:function(b,e){$assert(b,"size can not be null");
$assert($defined(b.width),"size seem not to be a valid element");
b={width:Math.ceil(b.width),height:Math.ceil(b.height)};
var d=this.getSize();
var a=d.width!=b.width||d.height!=b.height;
if(a||e){mindplot.NodeGraph.prototype.setSize.call(this,b);
var c=this.getOuterShape();
var f=this.getInnerShape();
c.setSize(b.width+4,b.height+6);
f.setSize(b.width,b.height);
this._updatePositionOnChangeSize(d,b);
if(a){mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeResizeEvent,{node:this.getModel(),size:b})
}}},_updatePositionOnChangeSize:function(){$assert(false,"this method must be overwrited.")
},disconnect:function(c){var f=this.getOutgoingLine();
if($defined(f)){$assert(c,"workspace can not be null");
this._outgoingLine=null;
var b=f.getTargetTopic();
b.removeChild(this);
var h=this.getModel();
h.disconnect();
this._parent=null;
f.removeFromWorkspace(c);
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeDisconnectEvent,this.getModel());
var d=this.getModel();
if(!d.getText()){var g=this.getText();
this._setText(g,false)
}if(!d.getFontSize()){var e=this.getFontSize();
this.setFontSize(e,false)
}if(b.getChildren().length==0){var a=b.getShrinkConnector();
if($defined(a)){a.setVisibility(false)
}}}},getOrder:function(){var a=this.getModel();
return a.getOrder()
},setOrder:function(b){var a=this.getModel();
a.setOrder(b)
},connectTo:function(b,d){$assert(!this._outgoingLine,"Could not connect an already connected node");
$assert(b!=this,"Circular connection are not allowed");
$assert(b,"Parent Graph can not be null");
$assert(d,"Workspace can not be null");
b.append(this);
this._parent=b;
var c=b.getModel();
var f=this.getModel();
f.connectTo(c);
var a=new mindplot.ConnectionLine(this,b);
a.setVisibility(false);
this._outgoingLine=a;
d.append(a);
this.updateTopicShape(b);
var g=this.getModel();
if(!g.getText()){var h=this.getText();
this._setText(h,false)
}if(!g.getFontSize()){var i=this.getFontSize();
this.setFontSize(i,false)
}this.getTextShape();
var e=b.getShrinkConnector();
if($defined(e)){e.setVisibility(true)
}a.redraw();
if(this.isInWorkspace()){mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeConnectEvent,{parentNode:b.getModel(),childNode:this.getModel()})
}},append:function(b){var a=this.getChildren();
a.push(b)
},removeChild:function(b){var a=this.getChildren();
a.erase(b)
},getChildren:function(){var a=this._children;
if(!$defined(a)){this._children=[];
a=this._children
}return a
},removeFromWorkspace:function(b){var c=this.get2DElement();
b.removeChild(c);
var a=this.getOutgoingLine();
if($defined(a)){b.removeChild(a)
}this._isInWorkspace=false;
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeRemoved,this.getModel())
},addToWorkspace:function(a){var b=this.get2DElement();
a.append(b);
if(!this.isInWorkspace()){if(!this.isCentralTopic()){mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeAdded,this.getModel())
}if(this.getModel().isConnected()){mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeConnectEvent,{parentNode:this.getOutgoingConnectedTopic().getModel(),childNode:this.getModel()})
}}this._isInWorkspace=true;
this._adjustShapes()
},isInWorkspace:function(){return this._isInWorkspace
},createDragNode:function(b){var a=this.parent(b);
var c=this.getOutgoingConnectedTopic();
if($defined(c)){a.connectTo(c);
a.setVisibility(false)
}this._getTopicEventDispatcher().close();
return a
},_adjustShapes:function(){if(this._isInWorkspace){var b=this.getTextShape();
if(this.getShapeType()!=mindplot.model.TopicShape.IMAGE){var e=b.getWidth();
var f=b.getHeight();
f=f!=0?f:20;
var g=mindplot.TopicStyle.getInnerPadding(this);
var d=this.getOrBuildIconGroup();
var c=this.getTextShape().getFontHeight();
d.setPosition(g,g);
d.seIconSize(c,c);
var j=d.getSize().width;
if(j!=0){j=j+(f/4)
}var h=f+(g*2);
var a=e+j+(g*2);
this.setSize({width:a,height:h});
b.setPosition(g+j,g)
}else{var i=this.getModel().getImageSize();
this.setSize(i)
}}},_flatten2DElements:function(b){var a=[];
var f=b.getChildren();
for(var e=0;
e<f.length;
e++){var g=f[e];
a.push(g);
a.push(g.getOutgoingLine());
var d=g.getRelationships();
a=a.concat(d);
if(!g.areChildrenShrunken()){var c=this._flatten2DElements(g);
a=a.concat(c)
}}return a
},isChildTopic:function(e){var a=(this.getId()==e.getId());
if(!a){var c=this.getChildren();
for(var b=0;
b<c.length;
b++){var d=c[b];
a=d.isChildTopic(e);
if(a){break
}}}return a
},isCentralTopic:function(){return this.getModel().getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE
}});
mindplot.Topic.CONNECTOR_WIDTH=6;
mindplot.Topic.OUTER_SHAPE_ATTRIBUTES={fillColor:"rgb(252,235,192)",stroke:"1 dot rgb(241,163,39)",x:0,y:0};
mindplot.Topic.OUTER_SHAPE_ATTRIBUTES_FOCUS={fillColor:"rgb(244,184,45)",x:0,y:0};
mindplot.Topic.INNER_RECT_ATTRIBUTES={stroke:"2 solid"};mindplot.CentralTopic=new Class({Extends:mindplot.Topic,initialize:function(b,a){this.parent(b,a)
},_registerEvents:function(){this.parent();
this.addEvent("mousedown",function(a){a.stopPropagation()
})
},workoutIncomingConnectionPoint:function(){return this.getPosition()
},setCursor:function(a){a=(a=="move")?"default":a;
this.parent(a)
},updateTopicShape:function(){},_updatePositionOnChangeSize:function(){var a=new core.Point(0,0);
this.setPosition(a)
},getShrinkConnector:function(){return null
},workoutOutgoingConnectionPoint:function(b){$assert(b,"targetPoint can not be null");
var d=this.getPosition();
var c=mindplot.util.Shape.isAtRight(b,d);
var a=this.getSize();
return mindplot.util.Shape.calculateRectConnectionPoint(d,a,!c)
}});mindplot.MainTopic=new Class({Extends:mindplot.Topic,initialize:function(b,a){this.parent(b,a)
},INNER_RECT_ATTRIBUTES:{stroke:"0.5 solid #009900"},_buildDragShape:function(){var f=this._buildShape(this.INNER_RECT_ATTRIBUTES,this.getShapeType());
var a=this.getSize();
f.setSize(a.width,a.height);
f.setPosition(0,0);
f.setOpacity(0.5);
f.setCursor("default");
f.setVisibility(true);
var h=this.getBorderColor();
f.setAttribute("strokeColor",h);
var c=this.getBackgroundColor();
f.setAttribute("fillColor",c);
var e={width:100,height:100,coordSizeWidth:100,coordSizeHeight:100};
var d=new web2d.Group(e);
d.append(f);
if(this.getShapeType()!=mindplot.model.TopicShape.IMAGE){var b=this._buildTextShape(true);
var g=this.getText();
b.setText(g);
b.setOpacity(0.5);
d.append(b)
}return d
},updateTopicShape:function(b,a){var c=this.getModel();
var d=c.getShapeType();
if(!b.isCentralTopic()){if(!$defined(d)){d=this.getShapeType();
this._setShapeType(d,false)
}}},disconnect:function(a){this.parent(a);
var c=this.getSize();
var b=this.getModel();
var d=b.getShapeType();
if(!$defined(d)){d=this.getShapeType();
this._setShapeType(mindplot.model.TopicShape.ROUNDED_RECT,false)
}var e=this.getInnerShape();
e.setVisibility(true)
},_updatePositionOnChangeSize:function(c,a){var b=Math.round((a.width-c.width)/2);
var d=this.getPosition();
if($defined(d)){if(d.x>0){d.x=d.x+b
}else{d.x=d.x-b
}this.setPosition(d)
}},workoutIncomingConnectionPoint:function(a){return mindplot.util.Shape.workoutIncomingConnectionPoint(this,a)
},workoutOutgoingConnectionPoint:function(f){$assert(f,"targetPoint can not be null");
var h=this.getPosition();
var g=mindplot.util.Shape.isAtRight(f,h);
var d=this.getSize();
var a;
if(this.getShapeType()==mindplot.model.TopicShape.LINE){a=new core.Point();
var b=this._elem2d.getPosition();
var c=this.getInnerShape().getSize();
if(c){var e=0.3;
if(!g){a.x=b.x+c.width-e
}else{a.x=b.x+e
}a.y=b.y+c.height
}else{if(!g){a.x=h.x+(d.width/2)
}else{a.x=h.x-(d.width/2)
}a.y=h.y+(d.height/2)
}}else{a=mindplot.util.Shape.calculateRectConnectionPoint(h,d,g,true)
}return a
}});mindplot.DragTopic=new Class({initialize:function(b,c,a){$assert(b,"Rect can not be null.");
$assert(c,"draggedNode can not be null.");
$assert(a,"layoutManger can not be null.");
this._elem2d=b;
this._order=null;
this._draggedNode=c;
this._layoutManager=a;
this._position=new core.Point();
this._isInWorkspace=false;
this._isFreeLayoutEnabled=false
},setOrder:function(a){this._order=a
},setPosition:function(i,h){var d={x:i,y:h};
if(this.isFreeLayoutOn()&&this.isConnected()){var l=this._layoutManager;
var g=this.getConnectedToTopic();
d=l.predict(g.getId(),this._draggedNode.getId(),d,true).position
}this._position.setValue(d.x,d.y);
var k=this._draggedNode;
var m=k.getSize();
var c=d.x-(d.x>0?0:m.width);
var b=Math.ceil(d.y-(m.height/2));
this._elem2d.setPosition(c,b);
if(this.isConnected()&&!this.isFreeLayoutOn()){var j=this.getConnectedToTopic();
var a=this._layoutManager.predict(j.getId(),this._draggedNode.getId(),this.getPosition());
if(this._order!=a.order){var f=this._getDragPivot();
var e=a.position;
f.connectTo(j,e);
this.setOrder(a.order)
}}},updateFreeLayout:function(c){var b=(c.metaKey&&Browser.Platform.mac)||(c.ctrlKey&&!Browser.Platform.mac);
if(this.isFreeLayoutOn()!=b){var a=this._getDragPivot();
a.setVisibility(!b);
this._isFreeLayoutEnabled=b
}},setVisibility:function(b){var a=this._getDragPivot();
a.setVisibility(b)
},isVisible:function(){var a=this._getDragPivot();
return a.isVisible()
},getInnerShape:function(){return this._elem2d
},disconnect:function(b){var a=this._getDragPivot();
a.disconnect(b)
},connectTo:function(c){$assert(c,"Parent connection node can not be null.");
var d=designer._eventBussDispatcher._layoutManager.predict(c.getId(),this._draggedNode.getId(),this.getPosition());
var b=this._getDragPivot();
var a=d.position;
b.connectTo(c,a);
b.setVisibility(true);
this.setOrder(d.order)
},getDraggedTopic:function(){return this._draggedNode
},removeFromWorkspace:function(b){if(this._isInWorkspace){b.removeChild(this._elem2d);
var a=this._getDragPivot();
a.setVisibility(false);
this._isInWorkspace=false
}},isInWorkspace:function(){return this._isInWorkspace
},addToWorkspace:function(b){if(!this._isInWorkspace){b.append(this._elem2d);
var a=this._getDragPivot();
a.addToWorkspace(b);
this._isInWorkspace=true
}},_getDragPivot:function(){return mindplot.DragTopic.__getDragPivot()
},getPosition:function(){return this._position
},isDragTopic:function(){return true
},applyChanges:function(c){$assert(c,"workspace can not be null");
var f=mindplot.ActionDispatcher.getInstance();
var d=this.getDraggedTopic();
var h=d.getId();
var g=this.getPosition();
if(!this.isFreeLayoutOn()){var e=null;
var i=null;
var a=this.isConnected();
if(a){var b=this.getConnectedToTopic();
e=this._order;
i=b
}f.dragTopic(h,g,e,i)
}else{f.moveTopic(h,g)
}},getConnectedToTopic:function(){var a=this._getDragPivot();
return a.getTargetTopic()
},isConnected:function(){return this.getConnectedToTopic()!=null
},isFreeLayoutOn:function(){return false
}});
mindplot.DragTopic.PIVOT_SIZE={width:50,height:6};
mindplot.DragTopic.init=function(b){$assert(b,"workspace can not be null");
var a=mindplot.DragTopic.__getDragPivot();
b.append(a)
};
mindplot.DragTopic.__getDragPivot=function(){var a=mindplot.DragTopic._dragPivot;
if(!$defined(a)){a=new mindplot.DragPivot();
mindplot.DragTopic._dragPivot=a
}return a
};mindplot.DragManager=new Class({initialize:function(b,a){this._workspace=b;
this._designerModel=b;
this._listeners={};
this._isDragInProcess=false;
this._eventDispatcher=a;
mindplot.DragTopic.init(this._workspace)
},add:function(f){var c=this._workspace;
var b=c.getScreenManager();
var d=this;
var e=this;
var a=function(i){if(c.isWorkspaceEventsEnabled()){c.enableWorkspaceEvents(false);
var g=e._eventDispatcher.getLayoutManager();
var j=f.createDragNode(g);
var h=d._buildMouseMoveListener(c,j,d);
b.addEvent("mousemove",h);
var k=d._buildMouseUpListener(c,f,j,d);
b.addEvent("mouseup",k);
window.document.body.style.cursor="move"
}};
f.addEvent("mousedown",a)
},remove:function(e){var a=this._topics;
var d=false;
var b=-1;
for(var c=0;
c<a.length;
c++){if(a[c]==e){d=true;
b=c
}}},_buildMouseMoveListener:function(c,f,d){var b=c.getScreenManager();
var e=this;
var a=function(i){if(!e._isDragInProcess){var g=d._listeners.startdragging;
g(i,f);
c.append(f);
e._isDragInProcess=true
}var j=b.getWorkspaceMousePosition(i);
f.setPosition(j.x,j.y);
var h=d._listeners.dragging;
if($defined(h)){h(i,f)
}i.preventDefault()
};
d._mouseMoveListener=a;
return a
},_buildMouseUpListener:function(c,f,g,d){var b=c.getScreenManager();
var e=this;
var a=function(i){$assert(g.isDragTopic,"dragNode must be an DragTopic");
b.removeEvent("mousemove",d._mouseMoveListener);
b.removeEvent("mouseup",d._mouseUpListener);
d._mouseMoveListener=null;
d._mouseUpListener=null;
c.enableWorkspaceEvents(true);
window.document.body.style.cursor="default";
if(e._isDragInProcess){var h=d._listeners.enddragging;
h(i,g);
g.removeFromWorkspace(c);
e._isDragInProcess=false
}};
d._mouseUpListener=a;
return a
},addEvent:function(a,b){this._listeners[a]=b
}});mindplot.DragPivot=new Class({initialize:function(){this._position=new core.Point();
this._size=mindplot.DragTopic.PIVOT_SIZE;
this._straightLine=this._buildStraightLine();
this._curvedLine=this._buildCurvedLine();
this._dragPivot=this._buildRect();
this._connectRect=this._buildRect();
this._targetTopic=null;
this._isVisible=false
},isVisible:function(){return this._isVisible
},getTargetTopic:function(){return this._targetTopic
},_buildStraightLine:function(){var a=new web2d.CurvedLine();
a.setStyle(web2d.CurvedLine.SIMPLE_LINE);
a.setStroke(1,"solid","#CC0033");
a.setOpacity(0.4);
a.setVisibility(false);
return a
},_buildCurvedLine:function(){var a=new web2d.CurvedLine();
a.setStyle(web2d.CurvedLine.SIMPLE_LINE);
a.setStroke(1,"solid","#CC0033");
a.setOpacity(0.4);
a.setVisibility(false);
return a
},_redrawLine:function(){$assert(this.getTargetTopic(),"Illegal invocation. Target node can not be null");
var i=this._getPivotRect();
var a=this.getTargetTopic();
var g=this._position;
var j=this._size;
var e=a.getPosition();
var k=this._getConnectionLine();
var c=mindplot.util.Shape.isAtRight(e,g);
var h=mindplot.util.Shape.calculateRectConnectionPoint(g,j,c);
k.setFrom(h.x,h.y);
var d=g.x-(parseInt(j.width)/2);
var b=g.y-(parseInt(j.height)/2);
i.setPosition(d,b);
var f=a.workoutIncomingConnectionPoint(h);
k.setTo(f.x,f.y)
},setPosition:function(a){this._position=a;
this._redrawLine()
},getPosition:function(){return this._position
},_buildRect:function(){var a=this._size;
var c={fillColor:"#CC0033",opacity:0.4,width:a.width,height:a.height,strokeColor:"#FF9933"};
var b=new web2d.Rect(0,c);
b.setVisibility(false);
return b
},_getPivotRect:function(){return this._dragPivot
},getSize:function(){var a=this._getPivotRect();
return a.getSize()
},setVisibility:function(d){if(this.isVisible()!=d){var c=this._getPivotRect();
c.setVisibility(d);
var b=this._connectRect;
b.setVisibility(d);
var a=this._getConnectionLine();
if(a){a.setVisibility(d)
}this._isVisible=d
}},_getConnectionLine:function(){var a=null;
var b=this._targetTopic;
if(b){if(b.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){a=this._straightLine
}else{a=this._curvedLine
}}return a
},addToWorkspace:function(c){var e=this._getPivotRect();
c.append(e);
var a=this._connectRect;
c.append(a);
var d=this._straightLine;
d.setVisibility(false);
c.append(d);
d.moveToBack();
var f=this._curvedLine;
f.setVisibility(false);
c.append(f);
f.moveToBack();
var b=this._connectRect;
b.setVisibility(false);
c.append(b);
b.moveToBack()
},removeFromWorkspace:function(c){var b=this._getPivotRect();
c.removeChild(b);
var a=this._connectRect;
c.removeChild(a);
if($defined(this._straightLine)){c.removeChild(this._straightLine)
}if($defined(this._curvedLine)){c.removeChild(this._curvedLine)
}},connectTo:function(a,g){$assert(!this._outgoingLine,"Could not connect an already connected node");
$assert(a!=this,"Circular connection are not allowed");
$assert(g,"position can not be null");
$assert(a,"parent can not be null");
this._position=g;
this._targetTopic=a;
var h=this._connectRect;
var d=a.getSize();
var b=d.width+4;
var j=d.height+4;
h.setSize(b,j);
var f=a.getPosition();
var e=Math.ceil(f.x-(b/2));
var c=Math.ceil(f.y-(j/2));
h.setPosition(e,c);
var i=this._getPivotRect();
i.moveToFront();
i.setPosition(g.x,g.y);
this._redrawLine()
},disconnect:function(a){$assert(a,"workspace can not be null.");
$assert(this._targetTopic,"There are not connected topic.");
this.setVisibility(false);
this._targetTopic=null
}});mindplot.ConnectionLine=new Class({initialize:function(c,f,e){$assert(f,"parentNode node can not be null");
$assert(c,"childNode node can not be null");
$assert(c!=f,"Circular connection");
this._targetTopic=f;
this._sourceTopic=c;
var a;
var b=this._getCtrlPoints(c,f);
if(f.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){a=this._createLine(e,mindplot.ConnectionLine.CURVED);
a.setSrcControlPoint(b[0]);
a.setDestControlPoint(b[1])
}else{a=this._createLine(e,mindplot.ConnectionLine.SIMPLE_CURVED);
a.setSrcControlPoint(b[0]);
a.setDestControlPoint(b[1])
}var d=mindplot.ConnectionLine.getStrokeColor();
a.setStroke(1,"solid",d,1);
a.setFill(d,1);
this._line2d=a
},_getCtrlPoints:function(d,e){var c=d.workoutOutgoingConnectionPoint(e.getPosition());
var b=e.workoutIncomingConnectionPoint(d.getPosition());
var a=(c.x-b.x)/3;
return[new core.Point(a,0),new core.Point(-a,0)]
},_createLine:function(b,c){if(!$defined(b)){b=c
}b=parseInt(b);
this._lineType=b;
var a=null;
switch(b){case mindplot.ConnectionLine.POLYLINE:a=new web2d.PolyLine();
break;
case mindplot.ConnectionLine.CURVED:a=new web2d.CurvedLine();
break;
case mindplot.ConnectionLine.SIMPLE_CURVED:a=new web2d.CurvedLine();
a.setStyle(web2d.CurvedLine.SIMPLE_LINE);
break;
default:a=new web2d.Line();
break
}return a
},setVisibility:function(a){this._line2d.setVisibility(a)
},isVisible:function(){return this._line2d.isVisible()
},setOpacity:function(a){this._line2d.setOpacity(a)
},redraw:function(){var g=this._line2d;
var a=this._sourceTopic;
var e=a.getPosition();
var c=this._targetTopic;
var f=c.getPosition();
var b,h;
b=a.workoutOutgoingConnectionPoint(f);
h=c.workoutIncomingConnectionPoint(e);
g.setFrom(h.x,h.y);
g.setTo(b.x,b.y);
if(g.getType()=="CurvedLine"){var d=this._getCtrlPoints(this._sourceTopic,this._targetTopic);
g.setSrcControlPoint(d[0]);
g.setDestControlPoint(d[1])
}this._positionateConnector(c)
},_positionateConnector:function(c){var d=c.getPosition();
var e=mindplot.Topic.CONNECTOR_WIDTH/2;
var g=c.getSize();
var f,a;
if(c.getShapeType()==mindplot.model.TopicShape.LINE){f=g.height
}else{f=g.height/2
}f=f-e;
var b=c.getShrinkConnector();
if($defined(b)){if(Math.sign(d.x)>0){a=g.width;
b.setPosition(a,f)
}else{a=-mindplot.Topic.CONNECTOR_WIDTH
}b.setPosition(a,f)
}},setStroke:function(a,c,b){this._line2d.setStroke(null,null,a,b)
},addToWorkspace:function(a){a.append(this._line2d);
this._line2d.moveToBack()
},removeFromWorkspace:function(a){a.removeChild(this._line2d)
},getTargetTopic:function(){return this._targetTopic
},getSourceTopic:function(){return this._sourceTopic
},getLineType:function(){return this._lineType
},getLine:function(){return this._line2d
},getModel:function(){return this._model
},setModel:function(a){this._model=a
},getType:function(){return"ConnectionLine"
},getId:function(){return this._model.getId()
},moveToBack:function(){this._line2d.moveToBack()
},moveToFront:function(){this._line2d.moveToFront()
}});
mindplot.ConnectionLine.getStrokeColor=function(){return"#495879"
};
mindplot.ConnectionLine.SIMPLE=0;
mindplot.ConnectionLine.POLYLINE=1;
mindplot.ConnectionLine.CURVED=2;
mindplot.ConnectionLine.SIMPLE_CURVED=3;mindplot.Relationship=new Class({Extends:mindplot.ConnectionLine,Static:{getStrokeColor:function(){return"#9b74e6"
},type:"Relationship"},initialize:function(e,g,d){$assert(e,"sourceNode can not be null");
$assert(g,"targetNode can not be null");
this.parent(e,g,d.getLineType());
this.setModel(d);
var f=mindplot.Relationship.getStrokeColor();
this._line2d.setIsSrcControlPointCustom(false);
this._line2d.setIsDestControlPointCustom(false);
this._line2d.setCursor("pointer");
this._line2d.setStroke(1,"solid",f);
this._line2d.setDashed(4,2);
this._focusShape=this._createLine(this.getLineType(),mindplot.ConnectionLine.SIMPLE_CURVED);
this._focusShape.setStroke(2,"solid","#3f96ff");
var c=this._line2d.getControlPoints();
this._focusShape.setSrcControlPoint(c[0]);
this._focusShape.setDestControlPoint(c[1]);
this._focusShape.setVisibility(false);
this._onFocus=false;
this._isInWorkspace=false;
this._controlPointsController=new mindplot.ControlPoint();
this._startArrow=new web2d.Arrow();
this._startArrow.setStrokeColor(f);
this._startArrow.setStrokeWidth(2);
this.setShowStartArrow(true);
if(this._showEndArrow){this._endArrow=new web2d.Arrow();
this._endArrow.setStrokeColor(f);
this._endArrow.setStrokeWidth(2)
}if($defined(d.getSrcCtrlPoint())){var b=d.getSrcCtrlPoint().clone();
this.setSrcControlPoint(b)
}if($defined(d.getDestCtrlPoint())){var a=d.getDestCtrlPoint().clone();
this.setDestControlPoint(a)
}},setStroke:function(a,c,b){this.parent(a,c,b);
this._startArrow.setStrokeColor(a)
},redraw:function(){var i=this._line2d;
var g=this._sourceTopic;
var d=g.getPosition();
var c=this._targetTopic;
var f=c.getPosition();
if(c.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){f=mindplot.util.Shape.workoutIncomingConnectionPoint(c,d)
}var j,h;
this._line2d.setStroke(2);
var k=this._line2d.getControlPoints();
if(!this._line2d.isDestControlPointCustom()&&!this._line2d.isSrcControlPointCustom()){var a=mindplot.util.Shape.calculateDefaultControlPoints(d,f);
k[0].x=a[0].x;
k[0].y=a[0].y;
k[1].x=a[1].x;
k[1].y=a[1].y
}var b=new core.Point();
b.x=parseInt(k[0].x)+parseInt(d.x);
b.y=parseInt(k[0].y)+parseInt(d.y);
var e=new core.Point();
e.x=parseInt(k[1].x)+parseInt(f.x);
e.y=parseInt(k[1].y)+parseInt(f.y);
j=mindplot.util.Shape.calculateRelationShipPointCoordinates(g,b);
h=mindplot.util.Shape.calculateRelationShipPointCoordinates(c,e);
i.setFrom(j.x,j.y);
i.setTo(h.x,h.y);
i.moveToFront();
this._positionArrows();
this._positionateConnector(c);
if(this.isOnFocus()){this._refreshShape()
}this._focusShape.moveToBack();
this._controlPointsController.redraw()
},_positionArrows:function(){var b=this._line2d.getTo();
var c=this._line2d.getFrom();
this._startArrow.setFrom(c.x,c.y);
this._startArrow.moveToBack();
if(this._endArrow){this._endArrow.setFrom(b.x,b.y);
this._endArrow.moveToBack()
}if(this._line2d.getType()=="CurvedLine"){var a=this._line2d.getControlPoints();
this._startArrow.setControlPoint(a[0]);
if(this._endArrow){this._endArrow.setControlPoint(a[1])
}}else{this._startArrow.setControlPoint(this._line2d.getTo());
if(this._endArrow){this._endArrow.setControlPoint(this._line2d.getFrom())
}}if(this._showEndArrow){this._endArrow.setVisibility(this.isVisible())
}this._startArrow.setVisibility(this.isVisible()&&this._showStartArrow)
},addToWorkspace:function(a){a.append(this._focusShape);
a.append(this._controlPointsController);
this._controlPointControllerListener=this._initializeControlPointController.bind(this);
this._line2d.addEvent("click",this._controlPointControllerListener);
this._isInWorkspace=true;
a.append(this._startArrow);
if(this._endArrow){a.append(this._endArrow)
}this.parent(a);
this._positionArrows();
this.redraw()
},_initializeControlPointController:function(){this.setOnFocus(true)
},removeFromWorkspace:function(a){a.removeChild(this._focusShape);
a.removeChild(this._controlPointsController);
this._line2d.removeEvent("click",this._controlPointControllerListener);
this._isInWorkspace=false;
a.removeChild(this._startArrow);
if(this._endArrow){a.removeChild(this._endArrow)
}this.parent(a)
},getType:function(){return mindplot.Relationship.type
},setOnFocus:function(a){if(this.isOnFocus()!=a){if(a){this._refreshShape();
this._controlPointsController.setLine(this)
}this._focusShape.setVisibility(a);
this._controlPointsController.setVisibility(a);
this._onFocus=a;
this.fireEvent(a?"ontfocus":"ontblur",this)
}},_refreshShape:function(){var a=this._line2d.getFrom();
var d=this._line2d.getTo();
var b=this._line2d.getControlPoints();
this._focusShape.setFrom(a.x,a.y);
this._focusShape.setTo(d.x,d.y);
var c=this._focusShape.getControlPoints();
c[0].x=b[0].x;
c[0].y=b[0].y;
c[1].x=b[1].x;
c[1].y=b[1].y;
this._focusShape.updateLine()
},addEvent:function(b,c){if(b=="onfocus"){b="mousedown"
}var a=this._line2d;
a.addEvent(b,c)
},isOnFocus:function(){return this._onFocus
},isInWorkspace:function(){return this._isInWorkspace
},setVisibility:function(a){this.parent(a);
if(this._showEndArrow){this._endArrow.setVisibility(this._showEndArrow)
}this._startArrow.setVisibility(this._showStartArrow&&a)
},setOpacity:function(a){this.parent(a);
if(this._showEndArrow){this._endArrow.setOpacity(a)
}if(this._showStartArrow){this._startArrow.setOpacity(a)
}},setShowEndArrow:function(a){this._showEndArrow=a;
if(this._isInWorkspace){this.redraw()
}},setShowStartArrow:function(a){this._showStartArrow=a;
if(this._isInWorkspace){this.redraw()
}},setFrom:function(a,b){$assert($defined(a),"x must be defined");
$assert($defined(b),"y must be defined");
this._line2d.setFrom(a,b);
this._startArrow.setFrom(a,b)
},setTo:function(a,b){$assert($defined(a),"x must be defined");
$assert($defined(b),"y must be defined");
this._line2d.setTo(a,b);
if(this._endArrow){this._endArrow.setFrom(a,b)
}},setSrcControlPoint:function(a){this._line2d.setSrcControlPoint(a);
this._startArrow.setControlPoint(a)
},setDestControlPoint:function(a){this._line2d.setDestControlPoint(a);
if(this._showEndArrow){this._endArrow.setControlPoint(a)
}},getControlPoints:function(){return this._line2d.getControlPoints()
},isSrcControlPointCustom:function(){return this._line2d.isSrcControlPointCustom()
},isDestControlPointCustom:function(){return this._line2d.isDestControlPointCustom()
},setIsSrcControlPointCustom:function(a){this._line2d.setIsSrcControlPointCustom(a)
},setIsDestControlPointCustom:function(a){this._line2d.setIsDestControlPointCustom(a)
},getId:function(){return this._model.getId()
},fireEvent:function(a,c){var b=this._line2d;
b.trigger(a,c)
}});mindplot.DragConnector=new Class({initialize:function(a,b){$assert(a,"designerModel can not be null");
$assert(b,"workspace can not be null");
this._designerModel=a;
this._workspace=b
},checkConnection:function(a){var d=this._designerModel.getTopics();
var c=this._searchConnectionCandidates(a);
var b=a.getConnectedToTopic();
if(b&&(c.length==0||c[0]!=b)){a.disconnect(this._workspace)
}if(!a.isConnected()&&c.length>0){a.connectTo(c[0])
}},_searchConnectionCandidates:function(c){var h=this._designerModel.getTopics();
var b=c.getDraggedTopic();
var g=c.getSize?c.getSize().width:0;
var f=c.getPosition().x>0?0:g;
var a={x:c.getPosition().x-f,y:c.getPosition().y};
h=h.filter(function(j){var i=b!=j;
i=i&&j!=b;
i=i&&!j.areChildrenShrunken()&&!j.isCollapsed();
i=i&&!b.isChildTopic(j);
return i
});
h=h.filter(function(k){var j=k.getPosition();
var i=j.x+(k.getSize().width/2)*Math.sign(a.x);
var l=(a.x-i)*Math.sign(a.x);
return l>0&&(l<mindplot.DragConnector.MAX_VERTICAL_CONNECTION_TOLERANCE)
});
var d=c.getConnectedToTopic();
var e=this;
h=h.sort(function(l,j){var k=l.getPosition();
var n=j.getPosition();
var m=e._isVerticallyAligned(l.getSize(),k,a);
var i=e._isVerticallyAligned(j.getSize(),n,a);
return e._proximityWeight(m,l,a,d)-e._proximityWeight(i,j,a,d)
});
return h
},_proximityWeight:function(a,d,b,c){var e=d.getPosition();
return(a?0:200)+Math.abs(e.x-b.x)+Math.abs(e.y-b.y)+(c==d?0:100)
},_isVerticallyAligned:function(c,b,a){return Math.abs(a.y-b.y)<c.height/2
}});
mindplot.DragConnector.MAX_VERTICAL_CONNECTION_TOLERANCE=80;mindplot.TextEditor=new Class({initialize:function(a){this._topic=a
},_buildEditor:function(){this._size={width:500,height:100};
var a=new Element("div");
a.setStyles({position:"absolute",display:"none",zIndex:"8",width:"500px",height:"100px"});
var e=new Element("div");
e.setStyles({border:"none",overflow:"auto"});
e.inject(a);
var c=new Element("input",{type:"text",tabindex:"-1",value:""});
c.setStyles({border:"none",background:"transparent"});
c.inject(e);
var d=new Element("div");
d.setStyle("visibility","hidden");
d.inject(a);
var b=new Element("span",{tabindex:"-1"});
b.setStyle("white-space","nowrap");
b.setStyle("nowrap","nowrap");
b.inject(d);
return a
},_registerEvents:function(d){var c=this._getTextareaElem();
var a=this._getSpanElem();
var b=this;
d.addEvent("keydown",function(f){switch(f.key){case"esc":b.close(false);
break;
case"enter":b.close(true);
break;
default:a.innerHTML=c.value;
var e=c.value.length+1;
c.size=e;
if(a.offsetWidth>(parseInt(d.style.width)-100)){d.style.width=(a.offsetWidth+100)+"px"
}break
}f.stopPropagation()
});
d.addEvent("click",function(e){e.stopPropagation()
});
d.addEvent("dblclick",function(e){e.stopPropagation()
});
d.addEvent("mousedown",function(e){e.stopPropagation()
})
},isVisible:function(){return $defined(this._containerElem)&&this._containerElem.getStyle("display")=="block"
},_updateModel:function(){if(this._topic.getText()!=this._getText()){var c=this._getText();
var a=this._topic.getId();
var b=mindplot.ActionDispatcher.getInstance();
b.changeTextToTopic([a],c)
}},show:function(b){if(!this.isVisible()){var a=this._buildEditor();
a.inject($(document.body)[0]);
this._containerElem=a;
this._registerEvents(a);
this._showEditor(b)
}},_showEditor:function(c){var b=this._topic;
b.getTextShape().setVisibility(false);
var e=b.getTextShape();
var a=e.getFont();
a.size=e.getHtmlFontSize();
a.color=e.getColor();
this._setStyle(a);
var g=$defined(c)?c:b.getText();
this._setText(g);
var f=this;
var d=function(){var h=f._topic.getTextShape();
f._containerElem.css("display","block");
f._containerElem.offset(h.getNativePosition());
var i=b.getSize();
f._setEditorSize(i.width,i.height);
var j=f._getTextareaElem();
j.focus();
f._positionCursor(j,!$defined(c))
};
d.delay(10)
},_setStyle:function(c){var a=this._getTextareaElem();
var b=this._getSpanElem();
if(!$defined(c.font)){c.font="Arial"
}if(!$defined(c.style)){c.style="normal"
}if(!$defined(c.weight)){c.weight="normal"
}if(!$defined(c.size)){c.size=12
}a.style.fontSize=c.size+"px";
a.style.fontFamily=c.font;
a.style.fontStyle=c.style;
a.style.fontWeight=c.weight;
a.style.color=c.color;
b.style.fontFamily=c.font;
b.style.fontStyle=c.style;
b.style.fontWeight=c.weight;
b.style.fontSize=c.size+"px"
},_setText:function(c){var a=this._getTextareaElem();
a.size=c.length+1;
this._containerElem.style.width=(a.size*parseInt(a.style.fontSize)+100)+"px";
var b=this._getSpanElem();
b.innerHTML=c;
a.value=c
},_getText:function(){return this._getTextareaElem().value
},_getTextareaElem:function(){return this._containerElem.getElement("input")
},_getSpanElem:function(){return this._containerElem.getElement("span")
},_setEditorSize:function(b,a){var c=this._topic.getTextShape();
var d=web2d.peer.utils.TransformUtil.workoutScale(c._peer);
this._size={width:b*d.width,height:a*d.height};
this._containerElem.style.width=this._size.width*2+"px";
this._containerElem.style.height=this._size.height+"px"
},_positionCursor:function(c,b){if(c.createTextRange){var a=c.createTextRange();
var d=c.value.length;
if(!b){a.select();
a.move("character",d)
}else{a.move("character",d);
a.select()
}}else{if(!b){c.setSelectionRange(0,c.value.length)
}}},close:function(a){if(this.isVisible()){if(!$defined(a)||a){this._updateModel()
}this._topic.getTextShape().setVisibility(true);
this._containerElem.dispose();
this._containerElem=null
}}});mindplot.MultilineTextEditor=new Class({Extends:mindplot.Events,initialize:function(){this._topic=null;
this._timeoutId=-1
},_buildEditor:function(){var a=$("<div></div>").attr("id","textContainer").css({display:"none",zIndex:"8",overflow:"hidden",border:"0 none"});
var b=$('<textarea tabindex="-1" value="" wrap="off" ></textarea>').css({border:"1px gray dashed",background:"rgba(98, 135, 167, .3)",outline:"0 none",resize:"none",overflow:"hidden"});
a.append(b);
return a
},_registerEvents:function(a){var c=this._getTextareaElem();
var b=this;
c.on("keydown",function(i){switch(jQuery.hotkeys.specialKeys[i.keyCode]){case"esc":b.close(false);
break;
case"enter":if(i.metaKey||i.ctrlKey){var j=c.val();
var d=j.length;
if(c.selectionStart){d=c.selectionStart
}var h=j.substring(0,d);
var g="";
if(d<j.length){g=j.substring(d,j.length)
}c.val(h+"\n"+g);
if(c[0].setSelectionRange){c.focus();
c[0].setSelectionRange(d+1,d+1)
}else{if(c.createTextRange){var f=c.createTextRange();
f.moveStart("character",d+1);
f.select()
}}}else{b.close(true)
}break;
case"tab":i.preventDefault();
var k=$(this).get(0).selectionStart;
var e=$(this).get(0).selectionEnd;
$(this).val($(this).val().substring(0,k)+"\t"+$(this).val().substring(e));
$(this).get(0).selectionStart=$(this).get(0).selectionEnd=k+1;
break
}i.stopPropagation()
});
c.on("keypress",function(d){d.stopPropagation()
});
c.on("keyup",function(d){var e=b._getTextareaElem().val();
b.fireEvent("input",[d,e]);
b._adjustEditorSize()
});
a.on("click",function(d){d.stopPropagation()
});
a.on("dblclick",function(d){d.stopPropagation()
});
a.on("mousedown",function(d){d.stopPropagation()
})
},_adjustEditorSize:function(){if(this.isVisible()){var c=this._getTextareaElem();
var b=c.val().split("\n");
var a=1;
_.each(b,function(d){if(a<d.length){a=d.length
}});
c.attr("cols",a);
c.attr("rows",b.length);
this._containerElem.css({width:(a+3)+"em",height:c.height()})
}},isVisible:function(){return $defined(this._containerElem)&&this._containerElem.css("display")=="block"
},_updateModel:function(){if(this._topic.getText()!=this._getText()){var c=this._getText();
var a=this._topic.getId();
var b=mindplot.ActionDispatcher.getInstance();
b.changeTextToTopic([a],c)
}},show:function(b,c){if(this._topic){this.close(false)
}this._topic=b;
if(!this.isVisible()){var a=this._buildEditor();
$("body").append(a);
this._containerElem=a;
this._registerEvents(a);
this._showEditor(c)
}},_showEditor:function(c){var b=this._topic;
b.getTextShape().setVisibility(false);
var e=b.getTextShape();
var a=e.getFont();
a.size=e.getHtmlFontSize();
a.color=e.getColor();
this._setStyle(a);
var f=this;
var d=function(){var h=b.getTextShape();
f._containerElem.css("display","block");
var i=h.getNativePosition();
f._containerElem.offset(i);
var j=$defined(c)?c:b.getText();
f._setText(j);
var g=f._getTextareaElem();
f._positionCursor(g,!$defined(c))
};
this._timeoutId=d.delay(10)
},_setStyle:function(c){var a=this._getTextareaElem();
if(!$defined(c.font)){c.font="Arial"
}if(!$defined(c.style)){c.style="normal"
}if(!$defined(c.weight)){c.weight="normal"
}if(!$defined(c.size)){c.size=12
}var b={fontSize:c.size+"px",fontFamily:c.font,fontStyle:c.style,fontWeight:c.weight,color:c.color};
a.css(b);
this._containerElem.css(b)
},_setText:function(a){var b=this._getTextareaElem();
b.val(a);
this._adjustEditorSize()
},_getText:function(){return this._getTextareaElem().val()
},_getTextareaElem:function(){return this._containerElem.find("textarea")
},_positionCursor:function(e,d){e.focus();
var c=e.val().length;
if(d){if(e.createTextRange){var b=e.createTextRange();
b.select();
b.move("character",c)
}else{e[0].setSelectionRange(0,c)
}}else{if(e.createTextRange){var a=e.createTextRange();
a.move("character",c)
}else{if(Browser.ie11){e[0].selectionStart=c;
e[0].selectionEnd=c
}else{e.selectionStart=c;
e.selectionEnd=c
}e.focus()
}}},close:function(a){if(this.isVisible()&&this._topic){clearTimeout(this._timeoutId);
if(!$defined(a)||a){this._updateModel()
}this._topic.getTextShape().setVisibility(true);
this._containerElem.remove();
this._containerElem=null;
this._timeoutId=-1
}this._topic=null
}});mindplot.TextEditorFactory={};
mindplot.TextEditorFactory.getTextEditorFromName=function(b){var a=null;
if(b=="RichTextEditor"){a=mindplot.RichTextEditor
}else{a=mindplot.TextEditor
}return a
};mindplot.util.Shape={isAtRight:function(a,b){$assert(a,"Source can not be null");
$assert(b,"Target can not be null");
return a.x<b.x
},calculateRectConnectionPoint:function(c,b,e){$assert(c,"rectCenterPoint can  not be null");
$assert(b,"rectSize can  not be null");
$assert($defined(e),"isRight can  not be null");
var a=new core.Point();
var d=2;
if(e){a.setValue(c.x-(b.width/2)+d,c.y)
}else{a.setValue(parseFloat(c.x)+(b.width/2)-d,c.y)
}return a
},calculateRelationShipPointCoordinates:function(d,g){var k=d.getSize();
var e=d.getPosition();
var b;
var a=e.y-g.y;
var f=e.x-g.x;
var c=Math.abs(a)<5||Math.abs(f)<5||Math.abs(a-f)<5;
var h,j;
var i=5;
if(g.y>e.y+(k.height/2)){h=e.y+(k.height/2)+i;
j=!c?e.x-((e.y-h)/(a/f)):e.x;
if(j>e.x+(k.width/2)){j=e.x+(k.width/2)
}else{if(j<e.x-(k.width/2)){j=e.x-(k.width/2)
}}}else{if(g.y<e.y-(k.height/2)){h=e.y-(k.height/2)-i;
j=!c?e.x-((e.y-h)/(a/f)):e.x;
if(j>e.x+(k.width/2)){j=e.x+(k.width/2)
}else{if(j<e.x-(k.width/2)){j=e.x-(k.width/2)
}}}else{if(g.x<(e.x-k.width/2)){j=e.x-(k.width/2)-i;
h=!c?e.y-((a/f)*(e.x-j)):e.y
}else{j=e.x+(k.width/2)+i;
h=!c?e.y-((a/f)*(e.x-j)):e.y
}}}return new core.Point(j,h)
},calculateDefaultControlPoints:function(f,d){var j=f.y-d.y;
var n=f.x-d.x;
var b=(Math.abs(n)>0.1?n:0.1);
var e=j/b;
var g=Math.sqrt(j*j+n*n)/3;
var h=1;
if(f.x>d.x){h=-1
}var c=f.x+Math.sqrt(g*g/(1+(e*e)))*h;
var k=e*(c-f.x)+f.y;
var a=d.x+Math.sqrt(g*g/(1+(e*e)))*h*-1;
var i=e*(a-d.x)+d.y;
return[new core.Point(-f.x+c,-f.y+k),new core.Point(-d.x+a,-d.y+i)]
},workoutIncomingConnectionPoint:function(d,c){$assert(c,"sourcePoint can not be null");
var g=d.getPosition();
var b=d.getSize();
var f=mindplot.util.Shape.isAtRight(c,g);
var a=mindplot.util.Shape.calculateRectConnectionPoint(g,b,f);
if(d.getShapeType()==mindplot.model.TopicShape.LINE){a.y=a.y+(d.getSize().height/2)
}var e=mindplot.Topic.CONNECTOR_WIDTH/2;
if(!f){a.x=a.x+e
}else{a.x=a.x-e
}a.x=Math.ceil(a.x);
a.y=Math.ceil(a.y);
return a
}};mindplot.util.FadeEffect=new Class({Extends:mindplot.Events,initialize:function(b,a){this._isVisible=a;
this._element=b
},start:function(){var a=this._isVisible;
_.each(this._element,function(b){if(b){b.setVisibility(a)
}});
this._isVisible=!a;
this.fireEvent("complete")
}});mindplot.persistence.ModelCodeName={BETA:"beta",PELA:"pela",TANGO:"tango"};mindplot.persistence.XMLSerializer_Pela=new Class({toXML:function(o){$assert(o,"Can not save a null mindmap");
var m=core.Utils.createDocument();
var n=m.createElement("map");
var b=o.getId();
if($defined(b)){n.setAttribute("name",this.rmXmlInv(b))
}var l=o.getVersion();
if($defined(l)){n.setAttribute("version",l)
}m.appendChild(n);
var a=o.getBranches();
for(var f=0;
f<a.length;
f++){var g=a[f];
var d=this._topicToXML(m,g);
n.appendChild(d)
}var k=o.getRelationships();
if(k.length>0){for(var e=0;
e<k.length;
e++){var h=k[e];
if(o.findNodeById(h.getFromNode())!==null&&o.findNodeById(h.getToNode())!==null){var c=this._relationshipToXML(m,h);
n.appendChild(c)
}}}return m
},_topicToXML:function(y,A){var v=y.createElement("topic");
if(A.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){v.setAttribute("central","true")
}else{var p=A.getPosition();
v.setAttribute("position",p.x+","+p.y);
var C=A.getOrder();
if(typeof C==="number"&&isFinite(C)){v.setAttribute("order",C)
}}var u=A.getText();
if($defined(u)){this._noteTextToXML(y,v,u)
}var b=A.getShapeType();
if($defined(b)){v.setAttribute("shape",b);
if(b==mindplot.model.TopicShape.IMAGE){v.setAttribute("image",A.getImageSize().width+","+A.getImageSize().height+":"+A.getImageUrl())
}}if(A.areChildrenShrunken()&&A.getType()!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){v.setAttribute("shrink","true")
}var x=A.getId();
v.setAttribute("id",x);
var w="";
var E=A.getFontFamily();
w+=(E?E:"")+";";
var f=A.getFontSize();
w+=(f?f:"")+";";
var c=A.getFontColor();
w+=(c?c:"")+";";
var s=A.getFontWeight();
w+=(s?s:"")+";";
var h=A.getFontStyle();
w+=(h?h:"")+";";
if($defined(E)||$defined(f)||$defined(c)||$defined(s)||$defined(h)){v.setAttribute("fontStyle",w)
}var o=A.getBackgroundColor();
if($defined(o)){v.setAttribute("bgColor",o)
}var e=A.getBorderColor();
if($defined(e)){v.setAttribute("brColor",e)
}var t=A.getMetadata();
if($defined(t)){v.setAttribute("metadata",t)
}var n=A.getFeatures();
for(var D=0;
D<n.length;
D++){var m=n[D];
var l=m.getType();
var d=y.createElement(l);
var r=m.getAttributes();
for(var F in r){var z=r[F];
if(F=="text"){var a=y.createCDATASection(this.rmXmlInv(z));
d.appendChild(a)
}else{d.setAttribute(F,this.rmXmlInv(z))
}}v.appendChild(d)
}var q=A.getChildren();
for(var B=0;
B<q.length;
B++){var g=q[B];
var k=this._topicToXML(y,g);
v.appendChild(k)
}return v
},_noteTextToXML:function(a,c,e){if(e.indexOf("\n")==-1){c.setAttribute("text",this.rmXmlInv(e))
}else{var b=a.createElement("text");
var d=a.createCDATASection(this.rmXmlInv(e));
b.appendChild(d);
c.appendChild(b)
}},_relationshipToXML:function(d,f){var c=d.createElement("relationship");
c.setAttribute("srcTopicId",f.getFromNode());
c.setAttribute("destTopicId",f.getToNode());
var e=f.getLineType();
c.setAttribute("lineType",e);
if(e==mindplot.ConnectionLine.CURVED||e==mindplot.ConnectionLine.SIMPLE_CURVED){if($defined(f.getSrcCtrlPoint())){var b=f.getSrcCtrlPoint();
c.setAttribute("srcCtrlPoint",Math.round(b.x)+","+Math.round(b.y))
}if($defined(f.getDestCtrlPoint())){var a=f.getDestCtrlPoint();
c.setAttribute("destCtrlPoint",Math.round(a.x)+","+Math.round(a.y))
}}c.setAttribute("endArrow",f.getEndArrow());
c.setAttribute("startArrow",f.getStartArrow());
return c
},loadFromDom:function(d,k){$assert(d,"dom can not be null");
$assert(k,"mapId can not be null");
var c=d.documentElement;
$assert(c.tagName==mindplot.persistence.XMLSerializer_Pela.MAP_ROOT_NODE,"This seem not to be a map document.");
this._idsMap={};
var h=c.getAttribute("version");
var j=new mindplot.model.Mindmap(k,h);
var b=c.childNodes;
for(var e=0;
e<b.length;
e++){var a=b[e];
if(a.nodeType==1){switch(a.tagName){case"topic":var f=this._deserializeNode(a,j);
j.addBranch(f);
break;
case"relationship":var g=this._deserializeRelationship(a,j);
if(g!=null){j.addRelationship(g)
}break
}}}this._idsMap=null;
j.setId(k);
return j
},_deserializeNode:function(b,a){var g=(b.getAttribute("central")!=null)?mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE:mindplot.model.INodeModel.MAIN_TOPIC_TYPE;
var y=b.getAttribute("id");
if($defined(y)){y=parseInt(y)
}if(this._idsMap[y]){y=null
}else{this._idsMap[y]=b
}var B=a.createNode(g,y);
var t=b.getAttribute("text");
if($defined(t)&&t){B.setText(t)
}var f=b.getAttribute("fontStyle");
if($defined(f)&&f){var v=f.split(";");
if(v[0]){B.setFontFamily(v[0])
}if(v[1]){B.setFontSize(v[1])
}if(v[2]){B.setFontColor(v[2])
}if(v[3]){B.setFontWeight(v[3])
}if(v[4]){B.setFontStyle(v[4])
}}var d=b.getAttribute("shape");
if($defined(d)){B.setShapeType(d);
if(d==mindplot.model.TopicShape.IMAGE){var x=b.getAttribute("image");
var w=x.substring(0,x.indexOf(":"));
var k=x.substring(x.indexOf(":")+1,x.length);
B.setImageUrl(k);
var A=w.split(",");
B.setImageSize(A[0],A[1])
}}var n=b.getAttribute("bgColor");
if($defined(n)){B.setBackgroundColor(n)
}var c=b.getAttribute("brColor");
if($defined(c)){B.setBorderColor(c)
}var D=b.getAttribute("order");
if($defined(D)&&D!="NaN"){B.setOrder(parseInt(D))
}var H=b.getAttribute("shrink");
if($defined(H)&&g!=mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){B.setChildrenShrunken(H)
}var G=b.getAttribute("position");
if($defined(G)){var p=G.split(",");
B.setPosition(p[0],p[1])
}var s=b.getAttribute("metadata");
if($defined(s)){B.setMetadata(s)
}var h=b.childNodes;
for(var F=0;
F<h.length;
F++){var o=h[F];
if(o.nodeType==Node.ELEMENT_NODE){if(o.tagName=="topic"){var e=this._deserializeNode(o,a);
e.connectTo(B)
}else{if(mindplot.TopicFeature.isSupported(o.tagName)){var E=o.attributes;
var q={};
for(var C=0;
C<E.length;
C++){var r=E.item(C);
q[r.name]=r.value
}var z=this._deserializeTextAttr(o);
if(z){q.text=z
}var l=o.tagName;
var m=mindplot.TopicFeature.createModel(l,q);
B.addFeature(m)
}else{if(o.tagName=="text"){var u=this._deserializeNodeText(o);
B.setText(u)
}}}}}return B
},_deserializeTextAttr:function(c){var d=c.getAttribute("text");
if(!$defined(d)){var b=c.childNodes;
for(var a=0;
a<b.length;
a++){var e=b[a];
if(e.nodeType==Node.CDATA_SECTION_NODE){d=e.nodeValue
}}}else{d=unescape(d);
if(d==""){d=" "
}}return d
},_deserializeNodeText:function(c){var b=c.childNodes;
var d=null;
for(var a=0;
a<b.length;
a++){var e=b[a];
if(e.nodeType==Node.CDATA_SECTION_NODE){d=e.nodeValue
}}return d
},_deserializeRelationship:function(e,i){var a=e.getAttribute("srcTopicId");
var d=e.getAttribute("destTopicId");
var g=e.getAttribute("lineType");
var c=e.getAttribute("srcCtrlPoint");
var j=e.getAttribute("destCtrlPoint");
var h=e.getAttribute("endArrow");
var b=e.getAttribute("startArrow");
if(a==d){return null
}if(i.findNodeById(a)==null||i.findNodeById(d)==null){return null
}var f=i.createRelationship(a,d);
f.setLineType(g);
if($defined(c)&&c!=""){f.setSrcCtrlPoint(core.Point.fromString(c))
}if($defined(j)&&j!=""){f.setDestCtrlPoint(core.Point.fromString(j))
}f.setEndArrow("false");
f.setStartArrow("true");
return f
},rmXmlInv:function(d){if(d==null||d==undefined){return null
}var a="";
for(var b=0;
b<d.length;
b++){var e=d.charCodeAt(b);
if((e==9)||(e==10)||(e==13)||((e>=32)&&(e<=55295))||((e>=57344)&&(e<=65533))||((e>=65536)&&(e<=1114111))){a=a+d.charAt(b)
}}return a
}});
mindplot.persistence.XMLSerializer_Pela.MAP_ROOT_NODE="map";mindplot.persistence.XMLSerializer_Tango=new Class({Extends:mindplot.persistence.XMLSerializer_Pela});mindplot.persistence.Pela2TangoMigrator=new Class({initialize:function(a){this._pelaSerializer=a;
this._tangoSerializer=new mindplot.persistence.XMLSerializer_Tango()
},toXML:function(a){return this._tangoSerializer.toXML(a)
},loadFromDom:function(c,b){$assert($defined(b),"mapId can not be null");
var a=this._pelaSerializer.loadFromDom(c,b);
a.setVersion(mindplot.persistence.ModelCodeName.TANGO);
this._fixOrder(a);
this._fixPosition(a);
return a
},_fixOrder:function(b){var f=b.getBranches()[0];
var e=f.getChildren();
var d=[];
var g=[];
for(var c=0;
c<e.length;
c++){var h=e[c];
var a=h.getPosition();
if(a.x<0){d.push(h)
}else{g.push(h)
}}g.sort(function(j,i){return j.getOrder()>i.getOrder()
});
d.sort(function(j,i){return j.getOrder()>i.getOrder()
});
for(c=0;
c<g.length;
c++){g[c].setOrder(c*2)
}for(c=0;
c<d.length;
c++){d[c].setOrder(c*2+1)
}},_fixPosition:function(b){var e=b.getBranches()[0];
var d=e.getChildren();
for(var c=0;
c<d.length;
c++){var f=d[c];
var a=f.getPosition();
this._fixNodePosition(f,a)
}},_fixNodePosition:function(d,e){var a=d.getPosition();
if(!a){a={x:e.x+30,y:e.y};
d.setPosition(a.x,a.y)
}var c=d.getChildren();
for(var b=0;
b<c.length;
b++){var f=c[b];
this._fixNodePosition(f,a)
}}});mindplot.persistence.XMLSerializer_Beta=new Class({toXML:function(b){$assert(b,"Can not save a null mindmap");
var a=core.Utils.createDocument();
var g=a.createElement("map");
var e=b.getId();
if($defined(e)){g.setAttribute("name",e)
}a.append(g);
var h=b.getBranches();
for(var f=0;
f<h.length;
f++){var d=h[f];
var c=this._topicToXML(a,d);
g.append(c)
}return a
},_topicToXML:function(v,w){var t=v.createElement("topic");
if(w.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){t.setAttribute("central",true)
}else{var p=w.getParent();
if(p==null||p.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){var m=w.getPosition();
t.setAttribute("position",m.x+","+m.y)
}else{var y=w.getOrder();
t.setAttribute("order",y)
}}var s=w.getText();
if($defined(s)){t.setAttribute("text",s)
}var a=w.getShapeType();
if($defined(a)){t.setAttribute("shape",a)
}if(w.areChildrenShrunken()){t.setAttribute("shrink",true)
}var u="";
var B=w.getFontFamily();
u+=(B?B:"")+";";
var f=w.getFontSize();
u+=(f?f:"")+";";
var c=w.getFontColor();
u+=(c?c:"")+";";
var r=w.getFontWeight();
u+=(r?r:"")+";";
var h=w.getFontStyle();
u+=(h?h:"")+";";
if($defined(B)||$defined(f)||$defined(c)||$defined(r)||$defined(h)){t.setAttribute("fontStyle",u)
}var l=w.getBackgroundColor();
if($defined(l)){t.setAttribute("bgColor",l)
}var e=w.getBorderColor();
if($defined(e)){t.setAttribute("brColor",e)
}var z;
var D=w.getIcons();
for(z=0;
z<D.length;
z++){var C=D[z];
var A=this._iconToXML(v,C);
t.append(A)
}var b=w.getLinks();
for(z=0;
z<b.length;
z++){var o=b[z];
var k=this._linkToXML(v,o);
t.append(k)
}var q=w.getNotes();
for(z=0;
z<q.length;
z++){var d=q[z];
var x=this._noteToXML(v,d);
t.append(x)
}var n=w.getChildren();
for(z=0;
z<n.length;
z++){var g=n[z];
var j=this._topicToXML(v,g);
t.append(j)
}return t
},_iconToXML:function(a,c){var b=a.createElement("icon");
b.setAttribute("id",c.getIconType());
return b
},_linkToXML:function(a,b){var c=a.createElement("link");
c.setAttribute("url",b.getUrl());
return c
},_noteToXML:function(a,c){var b=a.createElement("note");
b.setAttribute("text",c.getText());
return b
},loadFromDom:function(c,j){$assert(c,"Dom can not be null");
$assert(j,"mapId can not be null");
var h=c.documentElement;
$assert(h.nodeName!="parsererror","Error while parsing: '"+h.childNodes[0].nodeValue);
$assert(h.tagName==mindplot.persistence.XMLSerializer_Beta.MAP_ROOT_NODE,"This seem not to be a map document. Root Tag: '"+h.tagName+",',HTML:"+c.innerHTML+",XML:"+core.Utils.innerXML(c));
var f=h.getAttribute("version");
f=!$defined(f)?mindplot.persistence.ModelCodeName.BETA:f;
var g=new mindplot.model.Mindmap(j,f);
var b=h.childNodes;
for(var d=0;
d<b.length;
d++){var a=b[d];
if(a.nodeType==1){var e=this._deserializeNode(a,g);
g.addBranch(e)
}}g.setId(j);
return g
},_deserializeNode:function(b,a){var h=(b.getAttribute("central")!=null)?mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE:mindplot.model.INodeModel.MAIN_TOPIC_TYPE;
var q=a.createNode(h);
var o=b.getAttribute("text");
if($defined(o)){q.setText(o)
}var r=b.getAttribute("order");
if($defined(r)){q.setOrder(parseInt(r))
}var d=b.getAttribute("shape");
if($defined(d)){q.setShapeType(d)
}var v=b.getAttribute("shrink");
if($defined(v)){q.setChildrenShrunken(v)
}var g=b.getAttribute("fontStyle");
if($defined(g)){var p=g.split(";");
if(p[0]){q.setFontFamily(p[0])
}if(p[1]){q.setFontSize(p[1])
}if(p[2]){q.setFontColor(p[2])
}if(p[3]){q.setFontWeight(p[3])
}if(p[4]){q.setFontStyle(p[4])
}}var k=b.getAttribute("bgColor");
if($defined(k)){q.setBackgroundColor(k)
}var c=b.getAttribute("brColor");
if($defined(c)){q.setBorderColor(c)
}var u=b.getAttribute("position");
if($defined(u)){var l=u.split(",");
q.setPosition(l[0],l[1])
}var j=b.childNodes;
for(var s=0;
s<j.length;
s++){var m=j[s];
if(m.nodeType==1){$assert(m.tagName=="topic"||m.tagName=="icon"||m.tagName=="link"||m.tagName=="note","Illegal node type:"+m.tagName);
if(m.tagName=="topic"){var f=this._deserializeNode(m,a);
f.connectTo(q)
}else{if(m.tagName=="icon"){var t=this._deserializeIcon(m,q);
q.addFeature(t)
}else{if(m.tagName=="link"){var n=this._deserializeLink(m,q);
q.addFeature(n)
}else{if(m.tagName=="note"){var e=this._deserializeNote(m,q);
q.addFeature(e)
}}}}}}return q
},_deserializeIcon:function(b){var a=b.getAttribute("id");
a=a.replace("images/","icons/legacy/");
return mindplot.TopicFeature.createModel(mindplot.TopicFeature.Icon.id,{id:a})
},_deserializeLink:function(a){return mindplot.TopicFeature.createModel(mindplot.TopicFeature.Link.id,{url:a.getAttribute("url")})
},_deserializeNote:function(a){var b=a.getAttribute("text");
return mindplot.TopicFeature.createModel(mindplot.TopicFeature.Note.id,{text:b==null?" ":b})
}});
mindplot.persistence.XMLSerializer_Beta.MAP_ROOT_NODE="map";mindplot.persistence.Beta2PelaMigrator=new Class({initialize:function(a){this._betaSerializer=a;
this._pelaSerializer=new mindplot.persistence.XMLSerializer_Pela()
},toXML:function(a){return this._pelaSerializer.toXML(a)
},loadFromDom:function(e,c){$assert($defined(c),"mapId can not be null");
var a=this._betaSerializer.loadFromDom(e,c);
a.setVersion(mindplot.persistence.ModelCodeName.PELA);
var b=a.getBranches();
var d=this;
_.each(b,function(f){d._fixPosition(f)
});
return a
},_fixPosition:function(a){var d=a.getPosition();
var c=d.x>0;
var b=this;
_.each(a.getChildren(),function(e){if(!e.getPosition()){e.setPosition(d.x+(50*c?1:-1),d.y)
}b._fixPosition(e)
})
}});mindplot.persistence.XMLSerializerFactory={};
mindplot.persistence.XMLSerializerFactory.getSerializerFromMindmap=function(a){return mindplot.persistence.XMLSerializerFactory.getSerializer(a.getVersion())
};
mindplot.persistence.XMLSerializerFactory.getSerializerFromDocument=function(b){var a=b.documentElement;
return mindplot.persistence.XMLSerializerFactory.getSerializer(a.getAttribute("version"))
};
mindplot.persistence.XMLSerializerFactory.getSerializer=function(b){if(!$defined(b)){b=mindplot.persistence.ModelCodeName.BETA
}var a=mindplot.persistence.XMLSerializerFactory._codeNames;
var f=false;
var e=null;
for(var d=0;
d<a.length;
d++){if(!f){f=a[d].codeName==b;
if(f){e=new (a[d].serializer)()
}}else{var c=a[d].migrator;
e=new c(e)
}}return e
};
mindplot.persistence.XMLSerializerFactory._codeNames=[{codeName:mindplot.persistence.ModelCodeName.BETA,serializer:mindplot.persistence.XMLSerializer_Beta,migrator:function(){}},{codeName:mindplot.persistence.ModelCodeName.PELA,serializer:mindplot.persistence.XMLSerializer_Pela,migrator:mindplot.persistence.Beta2PelaMigrator},{codeName:mindplot.persistence.ModelCodeName.TANGO,serializer:mindplot.persistence.XMLSerializer_Tango,migrator:mindplot.persistence.Pela2TangoMigrator}];mindplot.PersistenceManager=new Class({Static:{loadFromDom:function(b,a){$assert(b,"mapId can not be null");
$assert(a,"mapDom can not be null");
var c=mindplot.persistence.XMLSerializerFactory.getSerializerFromDocument(a);
return c.loadFromDom(a,b)
}},initialize:function(){},save:function(h,c,i,k,d){$assert(h,"mindmap can not be null");
$assert(c,"editorProperties can not be null");
var j=h.getId();
$assert(j,"mapId can not be null");
var g=mindplot.persistence.XMLSerializerFactory.getSerializerFromMindmap(h);
var f=g.toXML(h);
var a=core.Utils.innerXML(f);
var l=JSON.stringify(c);
try{this.saveMapXml(j,a,l,i,k,d)
}catch(b){console.log(b);
k.onError(this._buildError())
}},load:function(a){$assert(a,"mapId can not be null");
var b=this.loadMapDom(a);
return mindplot.PersistenceManager.loadFromDom(a,b)
},discardChanges:function(a){throw new Error("Method must be implemented")
},loadMapDom:function(a){throw new Error("Method must be implemented")
},saveMapXml:function(c,e,a,f,b,d){throw new Error("Method must be implemented")
},unlockMap:function(a){throw new Error("Method must be implemented")
}});
mindplot.PersistenceManager.init=function(a){mindplot.PersistenceManager._instance=a
};
mindplot.PersistenceManager.getInstance=function(){return mindplot.PersistenceManager._instance
};mindplot.RESTPersistenceManager=new Class({Extends:mindplot.PersistenceManager,initialize:function(a){this.parent();
$assert(a.documentUrl,"documentUrl can not be null");
$assert(a.revertUrl,"revertUrl can not be null");
$assert(a.lockUrl,"lockUrl can not be null");
$assert(a.session,"session can not be null");
$assert(a.timestamp,"timestamp can not be null");
this.documentUrl=a.documentUrl;
this.revertUrl=a.revertUrl;
this.lockUrl=a.lockUrl;
this.timestamp=a.timestamp;
this.session=a.session
},saveMapXml:function(g,a,i,f,h,d){var b={id:g,xml:a,properties:i};
var e=this;
var c="minor="+!f;
c=c+"&timestamp="+this.timestamp;
c=c+"&session="+this.session;
if(!e.onSave){e.onSave=true;
e.clearTimeout=setTimeout(function(){e.clearTimeout=null;
e.onSave=false
},10000);
$.ajax({url:this.documentUrl.replace("{id}",g)+"?"+c,type:"put",dataType:"json",data:JSON.stringify(b),contentType:"application/json; charset=utf-8",async:!d,success:function(k,l,j){e.timestamp=k;
h.onSuccess()
},error:function(j,l,k){h.onError(e._buildError())
},complete:function(){if(e.clearTimeout){clearTimeout(e.clearTimeout)
}e.onSave=false
},fail:function(n,p){var l=n.responseText;
var j={severity:"SEVERE",message:$msg("SAVE_COULD_NOT_BE_COMPLETED")};
var o=n.getResponseHeader("Content-Type");
if(o!=null&&o.indexOf("application/json")!=-1){var k=null;
try{k=$.parseJSON(l);
k=k.globalSeverity?k:null
}catch(m){}j=e._buildError(k)
}else{if(this.status==405){j={severity:"SEVERE",message:$msg("SESSION_EXPIRED")}
}}h.onError(j);
e.onSave=false
}})
}},discardChanges:function(a){$.ajax({url:this.revertUrl.replace("{id}",a),async:false,method:"post",headers:{"Content-Type":"application/json; charset=utf-8",Accept:"application/json"}})
},unlockMap:function(a){var b=a.getId();
$.ajax({url:this.lockUrl.replace("{id}",b),async:false,method:"put",headers:{"Content-Type":"text/plain"},data:"false"})
},_buildError:function(c){var b=c?c.globalErrors[0]:null;
var a=c?c.globalSeverity:null;
if(!b){b=$msg("SAVE_COULD_NOT_BE_COMPLETED")
}if(!a){a="INFO"
}return{severity:a,message:b}
},loadMapDom:function(b){var a;
$.ajax({url:this.documentUrl.replace("{id}",b)+"/xml",method:"get",async:false,headers:{"Content-Type":"text/plain",Accept:"application/xml"},success:function(c){a=c
}});
if(a==null){throw new Error("Map could not be loaded")
}return a
}});mindplot.LocalStorageManager=new Class({Extends:mindplot.PersistenceManager,initialize:function(a,b){this.parent();
this.documentUrl=a;
this.forceLoad=b
},saveMapXml:function(c,d,a,e,b){localStorage.setItem(c+"-xml",d)
},discardChanges:function(a){localStorage.removeItem(a+"-xml")
},loadMapDom:function(b){var a=localStorage.getItem(b+"-xml");
if(a==null||this.forceLoad){$.ajax({url:this.documentUrl.replace("{id}",b),headers:{"Content-Type":"text/plain",Accept:"application/xml"},type:"get",dataType:"text",async:false,success:function(c){a=c
}});
if(a==null){throw new Error("Map could not be loaded")
}}return jQuery.parseXML(a)
},unlockMap:function(a){}});mindplot.EditorProperties=new Class({initialize:function(){this._zoom=0;
this._position=0
},setZoom:function(a){this._zoom=a
},getZoom:function(){return this._zoom
},asProperties:function(){return"zoom="+this._zoom+"\n"
}});mindplot.IconGroup=new Class({initialize:function(b,a){$assert($defined(b),"topicId can not be null");
$assert($defined(a),"iconSize can not be null");
this._icons=[];
this._group=new web2d.Group({width:0,height:a,x:0,y:0,coordSizeWidth:0,coordSizeHeight:100});
this._removeTip=new mindplot.IconGroup.RemoveTip(this._group,b);
this.seIconSize(a,a);
this._registerListeners()
},setPosition:function(a,b){this._group.setPosition(a,b)
},getPosition:function(){return this._group.getPosition()
},getNativeElement:function(){return this._group
},getSize:function(){return this._group.getSize()
},seIconSize:function(b,a){this._iconSize={width:b,height:a};
this._resize(this._icons.length)
},addIcon:function(b,a){$defined(b,"icon is not defined");
b.setGroup(this);
this._icons.push(b);
this._resize(this._icons.length);
this._positionIcon(b,this._icons.length-1);
var c=b.getImage();
this._group.append(c);
if(a){this._removeTip.decorate(this._topicId,b)
}},_findIconFromModel:function(b){var a=null;
_.each(this._icons,function(d){var c=d.getModel();
if(c.getId()==b.getId()){a=d
}},this);
if(a==null){throw new Error("Icon can no be found:"+b.getId()+", Icons:"+this._icons)
}return a
},removeIconByModel:function(b){$assert(b,"featureModel can not be null");
var a=this._findIconFromModel(b);
this._removeIcon(a)
},_removeIcon:function(a){$assert(a,"icon can not be null");
this._removeTip.close(0);
this._group.removeChild(a.getImage());
this._icons.erase(a);
this._resize(this._icons.length);
var b=this;
_.each(this._icons,function(d,c){b._positionIcon(d,c)
})
},moveToFront:function(){this._group.moveToFront()
},_registerListeners:function(){this._group.addEvent("click",function(a){a.stopPropagation()
});
this._group.addEvent("dblclick",function(a){a.stopPropagation()
})
},_resize:function(b){this._group.setSize(b*this._iconSize.width,this._iconSize.height);
var a=mindplot.Icon.SIZE+(mindplot.IconGroup.ICON_PADDING*2);
this._group.setCoordSize(b*a,a)
},_positionIcon:function(c,b){var a=mindplot.Icon.SIZE+(mindplot.IconGroup.ICON_PADDING*2);
c.getImage().setPosition(a*b+mindplot.IconGroup.ICON_PADDING,mindplot.IconGroup.ICON_PADDING)
}});
mindplot.IconGroup.ICON_PADDING=5;
mindplot.IconGroup.RemoveTip=new Class({initialize:function(a){$assert(a,"group can not be null");
this._fadeElem=a
},show:function(b,a){$assert(a,"icon can not be null");
if(this._activeIcon!=a){if(this._activeIcon){this.close(0)
}var e=a.getPosition();
var d=this._buildWeb2d();
d.addEvent("click",function(){a.remove()
});
var c=this;
d.addEvent("mouseover",function(){c.show(b,a)
});
d.addEvent("mouseout",function(){c.hide()
});
d.setPosition(e.x+80,e.y-50);
this._fadeElem.append(d);
this._activeIcon=a;
this._widget=d
}else{clearTimeout(this._closeTimeoutId)
}},hide:function(){this.close(200)
},close:function(a){if(this._closeTimeoutId){clearTimeout(this._closeTimeoutId)
}var b=this;
if(this._activeIcon){var c=this._widget;
var d=function(){b._activeIcon=null;
b._fadeElem.removeChild(c);
b._widget=null;
b._closeTimeoutId=null
};
if(!$defined(a)||a==0){d()
}else{this._closeTimeoutId=d.delay(a)
}}},_buildWeb2d:function(){var b=new web2d.Group({width:10,height:10,x:0,y:0,coordSizeWidth:10,coordSizeHeight:10});
var d=new web2d.Rect(0,{x:0,y:0,width:10,height:10,stroke:"0",fillColor:"black"});
b.append(d);
d.setCursor("pointer");
var e=new web2d.Rect(0,{x:1,y:1,width:8,height:8,stroke:"1 solid white",fillColor:"gray"});
b.append(e);
var c=new web2d.Line({stroke:"1 solid white"});
c.setFrom(1,1);
c.setTo(9,9);
b.append(c);
var a=new web2d.Line({stroke:"1 solid white"});
a.setFrom(1,9);
a.setTo(9,1);
b.append(a);
b.addEvent("mouseover",function(){e.setFill("#CC0033")
});
b.addEvent("mouseout",function(){e.setFill("gray")
});
b.setSize(50,50);
return b
},decorate:function(b,a){var c=this;
if(!a.__remove){a.addEvent("mouseover",function(){c.show(b,a)
});
a.addEvent("mouseout",function(){c.hide()
});
a.__remove=true
}}});mindplot.Icon=new Class({initialize:function(a){$assert(a,"topic can not be null");
this._image=new web2d.Image();
this._image.setHref(a);
this._image.setSize(mindplot.Icon.SIZE,mindplot.Icon.SIZE)
},getImage:function(){return this._image
},setGroup:function(a){this._group=a
},getGroup:function(){return this._group
},getSize:function(){return this._image.getSize()
},getPosition:function(){return this._image.getPosition()
},addEvent:function(a,b){this._image.addEvent(a,b)
},remove:function(){throw"Unsupported operation"
}});
mindplot.Icon.SIZE=90;mindplot.LinkIcon=new Class({Extends:mindplot.Icon,initialize:function(b,a,c){$assert(b,"topic can not be null");
$assert(a,"linkModel can not be null");
this.parent(mindplot.LinkIcon.IMAGE_URL);
this._linksModel=a;
this._topic=b;
this._readOnly=c;
this._registerEvents()
},_registerEvents:function(){this._image.setCursor("pointer");
this._tip=new mindplot.widget.LinkIconTooltip(this);
var a=this;
if(!this._readOnly){this.addEvent("click",function(b){a._tip.hide();
a._topic.showLinkEditor();
b.stopPropagation()
});
this.addEvent("mouseleave",function(b){window.setTimeout(function(){if(!$("#linkPopover:hover").length){a._tip.hide()
}b.stopPropagation()
},100)
})
}$(this.getImage()._peer._native).mouseenter(function(){a._tip.show()
})
},getModel:function(){return this._linksModel
}});
mindplot.LinkIcon.IMAGE_URL="images/links.png";mindplot.NoteIcon=new Class({Extends:mindplot.Icon,initialize:function(a,c,b){$assert(a,"topic can not be null");
this.parent(mindplot.NoteIcon.IMAGE_URL);
this._linksModel=c;
this._topic=a;
this._readOnly=b;
this._registerEvents()
},_registerEvents:function(){this._image.setCursor("pointer");
var a=this;
if(!this._readOnly){this.addEvent("click",function(b){a._topic.showNoteEditor();
b.stopPropagation()
})
}this._tip=new mindplot.widget.FloatingTip($(a.getImage()._peer._native),{title:$msg("NOTE"),container:"body",content:function(){return a._buildTooltipContent()
},html:true,placement:"bottom",destroyOnExit:true})
},_buildTooltipContent:function(){if($("body").find("#textPopoverNote").length==1){var b=$("body").find("#textPopoverNote");
b.text(this._linksModel.getText())
}else{var a=$('<div id="textPopoverNote"></div>').css({padding:"5px"});
var b=$("<div></div>").text(this._linksModel.getText()).css({"white-space":"pre-wrap","word-wrap":"break-word"});
a.append(b);
return a
}},getModel:function(){return this._linksModel
}});
mindplot.NoteIcon.IMAGE_URL="images/notes.png";mindplot.ActionIcon=new Class({Extends:mindplot.Icon,initialize:function(b,a){this.parent(a);
this._node=b
},getNode:function(){return this._node
},setPosition:function(a,c){var b=this.getSize();
this.getImage().setPosition(a-b.width/2,c-b.height/2)
},addEvent:function(b,a){this.getImage().addEvent(b,a)
},addToGroup:function(a){a.append(this.getImage())
},setVisibility:function(a){this.getImage().setVisibility(a)
},isVisible:function(){return this.getImage().isVisible()
},setCursor:function(a){return this.getImage().setCursor(a)
},moveToBack:function(a){return this.getImage().moveToBack(a)
},moveToFront:function(a){return this.getImage().moveToFront(a)
}});mindplot.ImageIcon=new Class({Extends:mindplot.Icon,initialize:function(b,d,g){$assert(d,"iconModel can not be null");
$assert(b,"topic can not be null");
this._topicId=b.getId();
this._featureModel=d;
var a=d.getIconType();
var f=this._getImageUrl(a);
this.parent(f);
if(!g){var e=this.getImage();
var c=this;
e.addEvent("click",function(){var h=d.getIconType();
var i=c._getNextFamilyIconId(h);
d.setIconType(i);
var j=c._getImageUrl(i);
c._image.setHref(j)
});
this._image.setCursor("pointer")
}},_getImageUrl:function(a){return"icons/"+a+".png"
},getModel:function(){return this._featureModel
},_getNextFamilyIconId:function(c){var d=this._getFamilyIcons(c);
$assert(d!=null,"Family Icon not found!");
var a=null;
for(var b=0;
b<d.length&&a==null;
b++){if(d[b]==c){if(b==(d.length-1)){a=d[0]
}else{a=d[b+1]
}break
}}return a
},_getFamilyIcons:function(e){$assert(e!=null,"id must not be null");
$assert(e.indexOf("_")!=-1,"Invalid icon id (it must contain '_')");
var a=null;
for(var b=0;
b<mindplot.ImageIcon.prototype.ICON_FAMILIES.length;
b++){var d=mindplot.ImageIcon.prototype.ICON_FAMILIES[b];
var c=e.substr(0,e.indexOf("_"));
if(d.id==c){a=d.icons;
break
}}return a
},remove:function(){var b=mindplot.ActionDispatcher.getInstance();
var c=this._featureModel.getId();
var a=this._topicId;
b.removeFeatureFromTopic(a,c)
}});
mindplot.ImageIcon.prototype.ICON_FAMILIES=[{id:"face",icons:["face_plain","face_sad","face_crying","face_smile","face_surprise","face_wink"]},{id:"funy",icons:["funy_angel","funy_devilish","funy_glasses","funy_grin","funy_kiss","funy_monkey"]},{id:"conn",icons:["conn_connect","conn_disconnect"]},{id:"sport",icons:["sport_basketball","sport_football","sport_golf","sport_raquet","sport_shuttlecock","sport_soccer","sport_tennis"]},{id:"bulb",icons:["bulb_light_on","bulb_light_off"]},{id:"thumb",icons:["thumb_thumb_up","thumb_thumb_down"]},{id:"tick",icons:["tick_tick","tick_cross"]},{id:"onoff",icons:["onoff_clock","onoff_clock_red","onoff_add","onoff_delete","onoff_status_offline","onoff_status_online"]},{id:"money",icons:["money_money","money_dollar","money_euro","money_pound","money_yen","money_coins","money_ruby"]},{id:"time",icons:["time_calendar","time_clock","time_hourglass"]},{id:"number",icons:["number_1","number_2","number_3","number_4","number_5","number_6","number_7","number_8","number_9"]},{id:"chart",icons:["chart_bar","chart_line","chart_curve","chart_pie","chart_organisation"]},{id:"sign",icons:["sign_warning","sign_info","sign_stop","sign_help","sign_cancel"]},{id:"hard",icons:["hard_cd","hard_computer","hard_controller","hard_driver_disk","hard_ipod","hard_keyboard","hard_mouse","hard_printer"]},{id:"soft",icons:["soft_bug","soft_cursor","soft_database_table","soft_database","soft_feed","soft_folder_explore","soft_rss","soft_penguin"]},{id:"arrow",icons:["arrow_up","arrow_down","arrow_left","arrow_right"]},{id:"arrowc",icons:["arrowc_rotate_anticlockwise","arrowc_rotate_clockwise","arrowc_turn_left","arrowc_turn_right"]},{id:"people",icons:["people_group","people_male1","people_male2","people_female1","people_female2"]},{id:"mail",icons:["mail_envelop","mail_mailbox","mail_edit","mail_list"]},{id:"flag",icons:["flag_blue","flag_green","flag_orange","flag_pink","flag_purple","flag_yellow"]},{id:"bullet",icons:["bullet_black","bullet_blue","bullet_green","bullet_orange","bullet_red","bullet_pink","bullet_purple"]},{id:"tag",icons:["tag_blue","tag_green","tag_orange","tag_red","tag_pink","tag_yellow"]},{id:"object",icons:["object_bell","object_clanbomber","object_key","object_pencil","object_phone","object_magnifier","object_clip","object_music","object_star","object_wizard","object_house","object_cake","object_camera","object_palette","object_rainbow"]},{id:"weather",icons:["weather_clear-night","weather_clear","weather_few-clouds-night","weather_few-clouds","weather_overcast","weather_severe-alert","weather_showers-scattered","weather_showers","weather_snow","weather_storm"]},{id:"task",icons:["task_0","task_25","task_50","task_75","task_100"]}];mindplot.model.FeatureModel=new Class({Static:{_nextUUID:function(){if(!$defined(mindplot.model.FeatureModel._uuid)){mindplot.model.FeatureModel._uuid=0
}mindplot.model.FeatureModel._uuid=mindplot.model.FeatureModel._uuid+1;
return mindplot.model.FeatureModel._uuid
}},initialize:function(a){$assert(a,"type can not be null");
this._id=mindplot.model.FeatureModel._nextUUID();
this._type=a;
this._attributes={};
this["is"+$.camelCase(a)+"Model"]=function(){return true
}
},getAttributes:function(){return Object.clone(this._attributes)
},setAttributes:function(a){for(key in a){this["set"+key.capitalize()](a[key])
}},setAttribute:function(a,b){$assert(a,"key id can not be null");
this._attributes[a]=b
},getAttribute:function(a){$assert(a,"key id can not be null");
return this._attributes[a]
},getId:function(){return this._id
},setId:function(a){this._id=a
},getType:function(){return this._type
}});mindplot.model.IconModel=new Class({Extends:mindplot.model.FeatureModel,initialize:function(a){this.parent(mindplot.model.IconModel.FEATURE_TYPE);
this.setIconType(a.id)
},getIconType:function(){return this.getAttribute("id")
},setIconType:function(a){$assert(a,"iconType id can not be null");
this.setAttribute("id",a)
}});
mindplot.model.IconModel.FEATURE_TYPE="icon";mindplot.model.LinkModel=new Class({Extends:mindplot.model.FeatureModel,initialize:function(a){this.parent(mindplot.model.LinkModel.FEATURE_TYPE);
this.setUrl(a.url)
},getUrl:function(){return this.getAttribute("url")
},setUrl:function(a){$assert(a,"url can not be null");
var c=this._fixUrl(a);
this.setAttribute("url",c);
var b=c.contains("mailto:")?"mail":"url";
this.setAttribute("urlType",b)
},_fixUrl:function(b){var a=b;
if(!a.contains("http://")&&!a.contains("https://")&&!a.contains("mailto://")){a="http://"+a
}return a
},setUrlType:function(a){$assert(a,"urlType can not be null");
this.setAttribute("urlType",a)
}});
mindplot.model.LinkModel.FEATURE_TYPE="link";mindplot.model.NoteModel=new Class({Extends:mindplot.model.FeatureModel,initialize:function(b){this.parent(mindplot.model.NoteModel.FEATURE_TYPE);
var a=b.text?b.text:" ";
this.setText(a)
},getText:function(){return this.getAttribute("text")
},setText:function(a){$assert(a,"text can not be null");
this.setAttribute("text",a)
}});
mindplot.model.NoteModel.FEATURE_TYPE="note";mindplot.Command=new Class({initialize:function(){this._id=mindplot.Command._nextUUID()
},execute:function(a){throw"execute must be implemented."
},undoExecute:function(a){throw"undo must be implemented."
},getId:function(){return this._id
}});
mindplot.Command._nextUUID=function(){if(!$defined(mindplot.Command._uuid)){mindplot.Command._uuid=1
}mindplot.Command._uuid=mindplot.Command._uuid+1;
return mindplot.Command._uuid
};mindplot.DesignerActionRunner=new Class({initialize:function(a,b){$assert(a,"commandContext can not be null");
this._undoManager=new mindplot.DesignerUndoManager();
this._context=a;
this._notifier=b
},execute:function(a){$assert(a,"command can not be null");
a.execute(this._context);
this._undoManager.enqueue(a);
this.fireChangeEvent();
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout)
},undo:function(){this._undoManager.execUndo(this._context);
this.fireChangeEvent();
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout)
},redo:function(){this._undoManager.execRedo(this._context);
this.fireChangeEvent();
mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout)
},fireChangeEvent:function(){var a=this._undoManager.buildEvent();
this._notifier.fireEvent("modelUpdate",a)
}});mindplot.DesignerUndoManager=new Class({initialize:function(a){this._undoQueue=[];
this._redoQueue=[];
this._baseId=0
},enqueue:function(c){$assert(c,"Command can  not be null");
var b=this._undoQueue.length;
if(c.discardDuplicated&&b>0){var a=this._undoQueue[b-1];
if(a.discardDuplicated!=c.discardDuplicated){this._undoQueue.push(c)
}}else{this._undoQueue.push(c)
}this._redoQueue=[]
},execUndo:function(a){if(this._undoQueue.length>0){var b=this._undoQueue.pop();
this._redoQueue.push(b);
b.undoExecute(a)
}},execRedo:function(a){if(this._redoQueue.length>0){var b=this._redoQueue.pop();
this._undoQueue.push(b);
b.execute(a)
}},buildEvent:function(){return{undoSteps:this._undoQueue.length,redoSteps:this._redoQueue.length}
},markAsChangeBase:function(){var a=this._undoQueue.length;
if(a>0){var b=this._undoQueue[a-1];
this._baseId=b.getId()
}else{this._baseId=0
}},hasBeenChanged:function(){var a=true;
var b=this._undoQueue.length;
if(b==0&&this._baseId==0){a=false
}else{if(b>0){var c=this._undoQueue[b-1];
a=(this._baseId!=c.getId())
}}return a
}});mindplot.ControlPoint=new Class({initialize:function(){var b=new web2d.Elipse({width:6,height:6,stroke:"1 solid #6589de",fillColor:"gray",visibility:false});
b.setCursor("pointer");
var a=new web2d.Elipse({width:6,height:6,stroke:"1 solid #6589de",fillColor:"gray",visibility:false});
a.setCursor("pointer");
this._controlPointsController=[b,a];
this._controlLines=[new web2d.Line({strokeColor:"#6589de",strokeWidth:1,opacity:0.3}),new web2d.Line({strokeColor:"#6589de",strokeWidth:1,opacity:0.3})];
this._isBinded=false;
var c=this;
this._controlPointsController[0].addEvent("mousedown",function(d){(c._mouseDown)(d,mindplot.ControlPoint.FROM,c)
});
this._controlPointsController[0].addEvent("click",function(d){(c._mouseClick)(d)
});
this._controlPointsController[0].addEvent("dblclick",function(d){(c._mouseClick)(d)
});
this._controlPointsController[1].addEvent("mousedown",function(d){(c._mouseDown)(d,mindplot.ControlPoint.TO,c)
});
this._controlPointsController[1].addEvent("click",function(d){(c._mouseClick)(d)
});
this._controlPointsController[1].addEvent("dblclick",function(d){(c._mouseClick)(d)
})
},setLine:function(a){if($defined(this._line)){this._removeLine()
}this._line=a;
this._createControlPoint();
this._endPoint=[];
this._orignalCtrlPoint=[];
this._orignalCtrlPoint[0]=this._controls[0].clone();
this._orignalCtrlPoint[1]=this._controls[1].clone();
this._endPoint[0]=this._line.getLine().getFrom().clone();
this._endPoint[1]=this._line.getLine().getTo().clone()
},redraw:function(){if($defined(this._line)){this._createControlPoint()
}},_createControlPoint:function(){this._controls=this._line.getLine().getControlPoints();
var a=this._line.getLine().getFrom();
this._controlPointsController[0].setPosition(this._controls[mindplot.ControlPoint.FROM].x+a.x,this._controls[mindplot.ControlPoint.FROM].y+a.y-3);
this._controlLines[0].setFrom(a.x,a.y);
this._controlLines[0].setTo(this._controls[mindplot.ControlPoint.FROM].x+a.x+3,this._controls[mindplot.ControlPoint.FROM].y+a.y);
a=this._line.getLine().getTo();
this._controlLines[1].setFrom(a.x,a.y);
this._controlLines[1].setTo(this._controls[mindplot.ControlPoint.TO].x+a.x+3,this._controls[mindplot.ControlPoint.TO].y+a.y);
this._controlPointsController[1].setPosition(this._controls[mindplot.ControlPoint.TO].x+a.x,this._controls[mindplot.ControlPoint.TO].y+a.y-3)
},_removeLine:function(){},_mouseDown:function(c,a,b){if(!this._isBinded){this._isBinded=true;
this._mouseMoveFunction=function(d){(b._mouseMoveEvent)(d,a,b)
};
this._workspace.getScreenManager().addEvent("mousemove",this._mouseMoveFunction);
this._mouseUpFunction=function(d){(b._mouseUp)(d,a,b)
};
this._workspace.getScreenManager().addEvent("mouseup",this._mouseUpFunction)
}c.preventDefault();
c.stopPropagation();
return false
},_mouseMoveEvent:function(c,a){var b=this._workspace.getScreenManager();
var e=b.getWorkspaceMousePosition(c);
var d;
if(a==0){d=mindplot.util.Shape.calculateRelationShipPointCoordinates(this._line.getSourceTopic(),e);
this._line.setFrom(d.x,d.y);
this._line.setSrcControlPoint(new core.Point(e.x-d.x,e.y-d.y))
}else{d=mindplot.util.Shape.calculateRelationShipPointCoordinates(this._line.getTargetTopic(),e);
this._line.setTo(d.x,d.y);
this._line.setDestControlPoint(new core.Point(e.x-d.x,e.y-d.y))
}this._controls[a].x=(e.x-d.x);
this._controls[a].y=(e.y-d.y);
this._controlPointsController[a].setPosition(e.x-5,e.y-3);
this._controlLines[a].setFrom(d.x,d.y);
this._controlLines[a].setTo(e.x-2,e.y);
this._line.getLine().updateLine(a)
},_mouseUp:function(b,a){this._workspace.getScreenManager().removeEvent("mousemove",this._mouseMoveFunction);
this._workspace.getScreenManager().removeEvent("mouseup",this._mouseUpFunction);
var c=mindplot.ActionDispatcher.getInstance();
c.moveControlPoint(this,a);
this._isBinded=false
},_mouseClick:function(a){a.preventDefault();
a.stopPropagation();
return false
},setVisibility:function(a){if(a){this._controlLines[0].moveToFront();
this._controlLines[1].moveToFront();
this._controlPointsController[0].moveToFront();
this._controlPointsController[1].moveToFront()
}this._controlPointsController[0].setVisibility(a);
this._controlPointsController[1].setVisibility(a);
this._controlLines[0].setVisibility(a);
this._controlLines[1].setVisibility(a)
},addToWorkspace:function(a){this._workspace=a;
a.append(this._controlPointsController[0]);
a.append(this._controlPointsController[1]);
a.append(this._controlLines[0]);
a.append(this._controlLines[1])
},removeFromWorkspace:function(a){this._workspace=null;
a.removeChild(this._controlPointsController[0]);
a.removeChild(this._controlPointsController[1]);
a.removeChild(this._controlLines[0]);
a.removeChild(this._controlLines[1])
},getControlPoint:function(a){return this._controls[a]
},getOriginalEndPoint:function(a){return this._endPoint[a]
},getOriginalCtrlPoint:function(a){return this._orignalCtrlPoint[a]
}});
mindplot.ControlPoint.FROM=0;
mindplot.ControlPoint.TO=1;mindplot.EditorOptions={LayoutManager:"OriginalLayout",textEditor:"TextEditor"};mindplot.RelationshipPivot=new Class({initialize:function(a,b){$assert(a,"workspace can not be null");
$assert(b,"designer can not be null");
this._workspace=a;
this._designer=b;
this._mouseMoveEvent=this._mouseMove.bind(this);
this._onClickEvent=this._cleanOnMouseClick.bind(this);
this._onTopicClick=this._connectOnFocus.bind(this)
},start:function(b,e){$assert(b,"sourceTopic can not be null");
$assert(e,"targetPos can not be null");
this.dispose();
this._sourceTopic=b;
if(b!=null){this._workspace.enableWorkspaceEvents(false);
var a=b.getPosition();
var f=mindplot.Relationship.getStrokeColor();
this._pivot=new web2d.CurvedLine();
this._pivot.setStyle(web2d.CurvedLine.SIMPLE_LINE);
var d=this._calculateFromPosition(a);
this._pivot.setFrom(d.x,d.y);
this._pivot.setTo(e.x,e.y);
this._pivot.setStroke(2,"solid",f);
this._pivot.setDashed(4,2);
this._startArrow=new web2d.Arrow();
this._startArrow.setStrokeColor(f);
this._startArrow.setStrokeWidth(2);
this._startArrow.setFrom(a.x,a.y);
this._workspace.append(this._pivot);
this._workspace.append(this._startArrow);
this._workspace.addEvent("mousemove",this._mouseMoveEvent);
this._workspace.addEvent("click",this._onClickEvent);
var c=this._designer.getModel();
var g=c.getTopics();
_.each(g,function(h){h.addEvent("ontfocus",this._onTopicClick)
}.bind(this))
}},dispose:function(){var a=this._workspace;
if(this._isActive()){a.removeEvent("mousemove",this._mouseMoveEvent);
a.removeEvent("click",this._onClickEvent);
var b=this._designer.getModel();
var d=b.getTopics();
var c=this;
_.each(d,function(e){e.removeEvent("ontfocus",c._onTopicClick)
});
a.removeChild(this._pivot);
a.removeChild(this._startArrow);
a.enableWorkspaceEvents(true);
this._sourceTopic=null;
this._pivot=null;
this._startArrow=null
}},_mouseMove:function(f){var c=this._workspace.getScreenManager();
var g=c.getWorkspaceMousePosition(f);
var e=this._sourceTopic.getPosition();
var d=Math.sign(g.x-e.x)*5;
var b=this._calculateFromPosition(g);
this._pivot.setFrom(b.x,b.y);
this._pivot.setTo(g.x-d,g.y);
var a=this._pivot.getControlPoints();
this._startArrow.setFrom(g.x-d,g.y);
this._startArrow.setControlPoint(a[1]);
f.stopPropagation();
return false
},_cleanOnMouseClick:function(a){this.dispose();
a.stopPropagation()
},_calculateFromPosition:function(d){var b=this._sourceTopic.getPosition();
if(this._sourceTopic.getType()==mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE){b=mindplot.util.Shape.workoutIncomingConnectionPoint(this._sourceTopic,d)
}var a=mindplot.util.Shape.calculateDefaultControlPoints(b,d);
var c=new core.Point();
c.x=parseInt(a[0].x)+parseInt(b.x);
c.y=parseInt(a[0].y)+parseInt(b.y);
return mindplot.util.Shape.calculateRelationShipPointCoordinates(this._sourceTopic,c)
},_connectOnFocus:function(e,d){var a=this._sourceTopic;
var b=this._designer.getMindmap();
if(d.getId()!=a.getId()){var c=b.createRelationship(d.getId(),a.getId());
this._designer._actionDispatcher.addRelationship(c)
}this.dispose()
},_isActive:function(){return this._pivot!=null
}});mindplot.TopicFeature={Icon:{id:mindplot.model.IconModel.FEATURE_TYPE,model:mindplot.model.IconModel,icon:mindplot.ImageIcon},Link:{id:mindplot.model.LinkModel.FEATURE_TYPE,model:mindplot.model.LinkModel,icon:mindplot.LinkIcon},Note:{id:mindplot.model.NoteModel.FEATURE_TYPE,model:mindplot.model.NoteModel,icon:mindplot.NoteIcon},isSupported:function(a){return mindplot.TopicFeature._featuresMetadataById.some(function(b){return b.id==a
})
},createModel:function(c,a){$assert(c,"type can not be null");
$assert(a,"attributes can not be null");
var b=mindplot.TopicFeature._featuresMetadataById.filter(function(d){return d.id==c
})[0].model;
return new b(a)
},createIcon:function(b,a,d){$assert(b,"topic can not be null");
$assert(a,"model can not be null");
var c=mindplot.TopicFeature._featuresMetadataById.filter(function(e){return e.id==a.getType()
})[0].icon;
return new c(b,a,d)
}};
mindplot.TopicFeature._featuresMetadataById=[mindplot.TopicFeature.Icon,mindplot.TopicFeature.Link,mindplot.TopicFeature.Note];mindplot.commands.GenericFunctionCommand=new Class({Extends:mindplot.Command,initialize:function(c,a,b){$assert(c,"commandFunc must be defined");
$assert($defined(a),"topicsIds must be defined");
this.parent();
this._value=b;
this._topicsId=a;
this._commandFunc=c;
this._oldValues=[]
},execute:function(a){if(!this.applied){var d=null;
try{d=a.findTopics(this._topicsId)
}catch(c){if(this._commandFunc.commandType!="changeTextToTopic"){throw c
}}if(d!=null){var b=this;
_.each(d,function(f){var e=b._commandFunc(f,b._value);
b._oldValues.push(e)
})
}this.applied=true
}else{throw"Command can not be applied two times in a row."
}},undoExecute:function(a){if(this.applied){var c=a.findTopics(this._topicsId);
var b=this;
_.each(c,function(e,d){b._commandFunc(e,b._oldValues[d])
});
this.applied=false;
this._oldValues=[]
}else{throw"undo can not be applied."
}}});mindplot.commands.DeleteCommand=new Class({Extends:mindplot.Command,initialize:function(b,a){$assert($defined(a),"topicIds can not be null");
this.parent();
this._relIds=a;
this._topicIds=b;
this._deletedTopicModels=[];
this._deletedRelModel=[];
this._parentTopicIds=[]
},execute:function(b){var c=this._filterChildren(this._topicIds,b);
if(c.length>0){_.each(c,function(g){g.closeEditors();
var f=g.getModel();
var h=this._collectInDepthRelationships(g);
this._deletedRelModel.append(h.map(function(j){return j.getModel().clone()
}));
_.each(h,function(j){b.deleteRelationship(j)
});
var e=f.clone();
this._deletedTopicModels.push(e);
var i=g.getOutgoingConnectedTopic();
var d=null;
if(i!=null){d=i.getId()
}this._parentTopicIds.push(d);
b.deleteTopic(g)
},this)
}var a=b.findRelationships(this._relIds);
if(a.length>0){_.each(a,function(d){this._deletedRelModel.push(d.getModel().clone());
b.deleteRelationship(d)
},this)
}},undoExecute:function(c){_.each(this._deletedTopicModels,function(d){c.createTopic(d)
},this);
_.each(this._deletedTopicModels,function(f,e){var h=c.findTopics(f.getId());
var g=this._parentTopicIds[e];
if(g){var d=c.findTopics(g);
c.connect(h[0],d[0])
}},this);
_.each(this._deletedRelModel,function(d){c.addRelationship(d)
});
_.each(this._deletedTopicModels,function(d){var e=c.findTopics(d.getId());
e[0].setBranchVisibility(true)
},this);
if(this._deletedTopicModels.length>0){var a=this._deletedTopicModels[0];
var b=c.findTopics(a.getId())[0];
b.setOnFocus(true)
}this._deletedTopicModels=[];
this._parentTopicIds=[];
this._deletedRelModel=[]
},_filterChildren:function(d,b){var c=b.findTopics(d);
var a=[];
_.each(c,function(e){var f=e.getParent();
var g=false;
while(f!=null&&!g){g=d.contains(f.getId());
if(g){break
}f=f.getParent()
}if(!g){a.push(e)
}});
return a
},_collectInDepthRelationships:function(d){var a=[];
a.append(d.getRelationships());
var f=d.getChildren();
var c=f.map(function(g){return this._collectInDepthRelationships(g)
},this);
a.append(c.flatten());
if(a.length>0){a=a.sort(function(h,g){return h.getModel().getId()-g.getModel().getId()
});
var b=[a[0]];
for(var e=1;
e<a.length;
e++){if(a[e-1]!==a[e]){b.push(a[e])
}}a=b
}return a
}});mindplot.commands.DragTopicCommand=new Class({Extends:mindplot.Command,initialize:function(d,b,a,c){$assert(d,"topicId must be defined");
this._topicsId=d;
if($defined(c)){this._parentId=c.getId()
}this.parent();
this._position=b;
this._order=a
},execute:function(e){var c=e.findTopics(this._topicsId)[0];
c.setVisibility(false);
var b=c.getOutgoingConnectedTopic();
var d=c.getOrder();
var f=c.getPosition();
if($defined(b)&&b!=this._parentId){e.disconnect(c)
}if(this._order!=null){c.setOrder(this._order)
}else{if(this._position!=null){e.moveTopic(c,this._position)
}else{$assert("Illegal command state exception.")
}}if(b!=this._parentId){if($defined(this._parentId)){var a=e.findTopics(this._parentId)[0];
e.connect(c,a)
}this._parentId=null;
if($defined(b)){this._parentId=b.getId()
}}c.setVisibility(true);
this._order=d;
this._position=f
},undoExecute:function(a){this.execute(a)
}});mindplot.commands.AddTopicCommand=new Class({Extends:mindplot.Command,initialize:function(b,a){$assert(b,"models can not be null");
$assert(a==null||a.length==b.length,"parents and models must have the same size");
this.parent();
this._models=b;
this._parentsIds=a
},execute:function(a){var b=this;
_.each(this._models,function(f,e){var d=a.createTopic(f);
if(b._parentsIds){var h=b._parentsIds[e];
if($defined(h)){var c=a.findTopics(h)[0];
a.connect(d,c)
}}else{a.addTopic(d)
}var g=a._designer;
g.onObjectFocusEvent(d);
d.setOnFocus(true);
d.setVisibility(true)
})
},undoExecute:function(b){var a=[];
_.each(this._models,function(c){a.push(c.clone())
});
_.each(this._models,function(d){var e=d.getId();
var c=b.findTopics(e)[0];
b.deleteTopic(c)
});
this._models=a
}});mindplot.commands.ChangeFeatureToTopicCommand=new Class({Extends:mindplot.Command,initialize:function(b,c,a){$assert($defined(b),"topicId can not be null");
$assert($defined(c),"featureId can not be null");
$assert($defined(a),"attributes can not be null");
this.parent();
this._topicId=b;
this._featureId=c;
this._attributes=a
},execute:function(d){var b=d.findTopics(this._topicId)[0];
var c=b.findFeatureById(this._featureId);
var a=c.getAttributes();
c.setAttributes(this._attributes);
this._attributes=a
},undoExecute:function(a){this.execute(a)
}});mindplot.commands.RemoveFeatureFromTopicCommand=new Class({Extends:mindplot.Command,initialize:function(a,b){$assert($defined(a),"topicId can not be null");
$assert(b,"iconModel can not be null");
this.parent();
this._topicId=a;
this._featureId=b;
this._oldFeature=null
},execute:function(c){var a=c.findTopics(this._topicId)[0];
var b=a.findFeatureById(this._featureId);
a.removeFeature(b);
this._oldFeature=b
},undoExecute:function(b){var a=b.findTopics(this._topicId)[0];
a.addFeature(this._oldFeature);
this._oldFeature=null
}});mindplot.commands.AddFeatureToTopicCommand=new Class({Extends:mindplot.Command,initialize:function(c,b,a){$assert($defined(c),"topicId can not be null");
$assert(b,"featureType can not be null");
$assert(a,"attributes can not be null");
this.parent();
this._topicId=c;
this._featureType=b;
this._attributes=a;
this._featureModel=null
},execute:function(c){var b=c.findTopics(this._topicId)[0];
if(!this._featureModel){var a=b.getModel();
this._featureModel=a.createFeature(this._featureType,this._attributes)
}b.addFeature(this._featureModel)
},undoExecute:function(b){var a=b.findTopics(this._topicId)[0];
a.removeFeature(this._featureModel)
}});mindplot.commands.AddRelationshipCommand=new Class({Extends:mindplot.Command,initialize:function(a){$assert(a,"Relationship model can not be null");
this.parent();
this._model=a
},execute:function(a){var b=a.addRelationship(this._model);
b.setOnFocus(true)
},undoExecute:function(b){var a=b.findRelationships(this._model.getId());
b.deleteRelationship(a[0])
}});mindplot.commands.MoveControlPointCommand=new Class({Extends:mindplot.Command,initialize:function(b,a){$assert(b,"line can not be null");
$assert($defined(a),"point can not be null");
this.parent();
this._ctrlPointControler=b;
this._line=b._line;
this._controlPoint=this._ctrlPointControler.getControlPoint(a).clone();
this._oldControlPoint=this._ctrlPointControler.getOriginalCtrlPoint(a).clone();
this._originalEndPoint=this._ctrlPointControler.getOriginalEndPoint(a).clone();
switch(a){case 0:this._wasCustom=this._line.getLine().isSrcControlPointCustom();
this._endPoint=this._line.getLine().getFrom().clone();
break;
case 1:this._wasCustom=this._line.getLine().isDestControlPointCustom();
this._endPoint=this._line.getLine().getTo().clone();
break
}this._point=a
},execute:function(b){var a=this._line.getModel();
switch(this._point){case 0:a.setSrcCtrlPoint(this._controlPoint.clone());
this._line.setFrom(this._endPoint.x,this._endPoint.y);
this._line.setIsSrcControlPointCustom(true);
this._line.setSrcControlPoint(this._controlPoint.clone());
break;
case 1:a.setDestCtrlPoint(this._controlPoint.clone());
this._wasCustom=this._line.getLine().isDestControlPointCustom();
this._line.setTo(this._endPoint.x,this._endPoint.y);
this._line.setIsDestControlPointCustom(true);
this._line.setDestControlPoint(this._controlPoint.clone());
break
}if(this._line.isOnFocus()){this._line._refreshShape();
this._ctrlPointControler.setLine(this._line)
}this._line.getLine().updateLine(this._point)
},undoExecute:function(c){var a=this._line;
var b=a.getModel();
switch(this._point){case 0:if($defined(this._oldControlPoint)){a.setFrom(this._originalEndPoint.x,this._originalEndPoint.y);
b.setSrcCtrlPoint(this._oldControlPoint.clone());
a.setSrcControlPoint(this._oldControlPoint.clone());
a.setIsSrcControlPointCustom(this._wasCustom)
}break;
case 1:if($defined(this._oldControlPoint)){a.setTo(this._originalEndPoint.x,this._originalEndPoint.y);
b.setDestCtrlPoint(this._oldControlPoint.clone());
a.setDestControlPoint(this._oldControlPoint.clone());
a.setIsDestControlPointCustom(this._wasCustom)
}break
}this._line.getLine().updateLine(this._point);
if(this._line.isOnFocus()){this._ctrlPointControler.setLine(a);
a._refreshShape()
}}});mindplot.widget.ModalDialogNotifier=new Class({initialize:function(){},show:function(c,e){$assert(c,"message can not be null");
var b=$('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"></div><div class="alert alert-block alert-warning"><img src="images/alert-sign.png"><div style="display: inline-block" class="alert-content"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
var d="<p>"+c+"</p>";
var a=e?"<h4>"+e+"</h4>":"";
b.find(".alert-content").append(a+d);
b.modal()
}});
var dialogNotifier=new mindplot.widget.ModalDialogNotifier();
$notifyModal=dialogNotifier.show.bind(dialogNotifier);mindplot.widget.ToolbarNotifier=new Class({initialize:function(){this.container=$("#headerNotifier")
},hide:function(){this.container.hide()
},logMessage:function(b,a){$assert(b,"msg can not be null");
if(this.container&&!this.container.data("transitioning")){this.container.data("transitioning",true);
this.container.text(b);
this.container.css({top:"5px",left:($(window).width()-this.container.width())/2-9});
this.container.show().fadeOut(5000)
}this.container.data("transitioning",false)
}});
var toolbarNotifier=new mindplot.widget.ToolbarNotifier();
$notify=function(a){toolbarNotifier.logMessage(a)
};mindplot.widget.ToolbarItem=new Class({Implements:mindplot.Events,initialize:function(c,b,a){$assert(c,"buttonId can not be null");
$assert(b,"fn can not be null");
this._buttonId=c;
this._fn=b;
this._options=a;
this._enable=false;
this.enable()
},getButtonElem:function(){var a=$("#"+this._buttonId);
$assert(a,"Could not find element for "+this._buttonId);
return a
}.protect(),show:function(){this.fireEvent("show")
},hide:function(){this.fireEvent("hide")
},isTopicAction:function(){return this._options.topicAction
},isRelAction:function(){return this._options.relAction
},disable:function(){var a=this.getButtonElem();
if(this._enable){a.unbind("click",this._fn);
a.removeClass("buttonOn");
a.addClass("buttonOff");
this._enable=false
}},enable:function(){var a=this.getButtonElem();
if(!this._enable){a.bind("click",this._fn);
a.removeClass("buttonOff");
a.addClass("buttonOn");
this._enable=true
}},getTip:function(){return this._tip
}.protect()});mindplot.widget.ToolbarPaneItem=new Class({Extends:mindplot.widget.ToolbarItem,initialize:function(c,a){$assert(c,"buttonId can not be null");
$assert(a,"model can not be null");
this._model=a;
var d=this;
var b=function(){d.isVisible()?d.hide():d.show()
};
this.parent(c,b,{topicAction:true,relAction:false});
this._panelElem=this._init();
this._visible=false
},_init:function(){var a=this.buildPanel();
a.css("cursor","default");
var b=this.getButtonElem();
var c=this;
this._tip=new mindplot.widget.FloatingTip(b,{html:true,placement:"bottom",content:function(){return c._updateSelectedItem()
},className:"toolbarPaneTip",trigger:"manual",template:'<div class="popover popoverGray" role="tooltip"><div class="arrow arrowGray"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});
this._tip.addEvent("hide",function(){c._visible=false
});
this._tip.addEvent("show",function(){c._visible=true
});
return a
},getModel:function(){return this._model
},getPanelElem:function(){return this._panelElem
}.protect(),show:function(){if(!this.isVisible()){this.parent();
this._tip.show();
this.getButtonElem().className="buttonExtActive"
}},hide:function(){if(this.isVisible()){this.parent();
this._tip.hide();
this.getButtonElem().className="buttonExtOn"
}},isVisible:function(){return this._visible
},disable:function(){this.hide();
var a=this.getButtonElem();
if(this._enable){a.unbind("click",this._fn);
a.removeClass("buttonExtOn");
a.removeClass("buttonOn");
a.addClass("buttonExtOff");
this._enable=false
}},enable:function(){var a=this.getButtonElem();
if(!this._enable){a.bind("click",this._fn);
a.removeClass("buttonExtOff");
a.addClass("buttonExtOn");
this._enable=true
}},buildPanel:function(){throw"Method must be implemented"
}.protect()});mindplot.widget.NoteEditor=new Class({Extends:BootstrapDialog,initialize:function(b){$assert(b,"model can not be null");
this._model=b;
this.parent($msg("Note"),{cancelButton:true,closeButton:true,acceptButton:true,removeButton:typeof b.getValue()!="undefined",onEventData:{model:this._model}});
this.css({margin:"150px auto"});
var a=this._buildPanel(b);
this.setContent(a)
},_buildPanel:function(b){var a=$("<div></div>").css("padding-top","5px");
var c=$("<form></form>").attr({action:"none",id:"noteFormId"});
var d=$("<textarea></textarea autofocus>").attr({placeholder:$msg("WRITE_YOUR_TEXT_HERE"),required:"true","class":"form-control"});
d.css({width:"100%",height:80,resize:"none"});
d.on("keypress",function(e){e.stopPropagation()
});
c.append(d);
if(b.getValue()!=null){d.val(b.getValue())
}a.append(c);
return a
},onAcceptClick:function(a){a.data.dialog._submitForm(a.data.model)
},_submitForm:function(b){var a=this._native.find("textarea");
if(a.val()){b.setValue(a.val())
}this.close()
},onDialogShown:function(){$(this).find("textarea").focus()
},onRemoveClick:function(a){a.data.model.setValue(null);
a.data.dialog.close()
}});mindplot.widget.LinkEditor=new Class({Extends:BootstrapDialog,initialize:function(b){$assert(b,"model can not be null");
this._model=b;
this.parent($msg("LINK"),{cancelButton:true,closeButton:true,acceptButton:true,removeButton:typeof b.getValue()!="undefined",errorMessage:true,onEventData:{model:this._model}});
this.css({margin:"150px auto"});
var a=this._buildPanel(b);
this.setContent(a)
},_buildPanel:function(d){var a=$("<div></div>").css("padding-top","5px");
this.form=$("<form></form>").attr({action:"none",id:"linkFormId"});
var h=$("<p></p>").text("Paste your url here:");
h.css("margin","0px 0px 20px");
this.form.append(h);
var f=$("<div></div>").attr({"class":"input-group"});
var c=$('<input id="inputUrl"/>').attr({placeholder:"http://www.example.com/",required:"true",autofocus:"autofocus","class":"form-control"});
c.on("keypress",function(i){i.stopPropagation()
});
if(d.getValue()!=null){c.val(d.getValue())
}var b=$("<button></button>").attr({type:"button","class":"btn btn-default"});
b.html($msg("OPEN_LINK")).css("margin-left","0px");
b.click(function(){window.open(c.val(),"_blank","status=1,width=700,height=450,resize=1")
});
var g=$('<span class="input-group-btn"></span>').append(b);
f.append(c);
f.append(g);
this.form.append(f);
var e=this;
this.form.unbind("submit").submit(function(j){j.preventDefault();
if(e.checkURL(c.val())){e.cleanError();
var i=c.val();
if(i!=null&&$.trim(i)!=""){d.setValue(i)
}e.close();
this.formSubmitted=true
}else{e.alertError($msg("URL_ERROR"));
j.stopPropagation()
}});
a.append(this.form);
return a
},checkURL:function(a){var b=/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
return(b.test(a))
},onAcceptClick:function(a){this.formSubmitted=false;
$("#linkFormId").trigger("submit");
if(!this.formSubmitted){a.stopPropagation()
}},onDialogShown:function(){$(this).find("#inputUrl").focus()
},onRemoveClick:function(a){a.data.model.setValue(null);
a.data.dialog.close()
}});mindplot.widget.FloatingTip=new Class({Implements:[Options,mindplot.Events],options:{animation:true,html:false,placement:"right",selector:false,trigger:"hover",title:"",content:"",delay:0,container:false,destroyOnExit:false},initialize:function(b,a){this.setOptions(a);
this.element=b;
this._createPopover()
},_createPopover:function(){this.element.popover(this.options);
var a=this;
if(this.options.destroyOnExit){this.element.one("hidden.bs.popover",function(){a.element.popover("destroy");
a._createPopover()
})
}},show:function(){this.element.popover("show");
this.fireEvent("show");
return this
},hide:function(){this.element.popover("hide");
this.fireEvent("hide");
return this
}});mindplot.widget.LinkIconTooltip=new Class({Extends:mindplot.widget.FloatingTip,initialize:function(a){$assert(a,"linkIcon can not be null");
var b=$(a.getImage()._peer._native);
this.parent(b,{content:this._buildContent(a),html:true,placement:"bottom",container:"body",title:$msg("LINK"),trigger:"manual",template:'<div id="linkPopover" class="popover" onmouseover="$(this).mouseleave(function() {$(this).fadeOut(200); });" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
},_buildContent:function(b){var a=$("<div></div>").css({padding:"5px",width:"100%"});
var f=$("<div></div>").text("URL: "+b.getModel().getUrl()).css({"white-space":"pre-wrap","word-wrap":"break-word"});
a.append(f);
var c=$("<div></div>").css({width:"100%",textAlign:"right","padding-bottom":"5px","padding-top":"5px"});
var d=$("<img>").prop("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAAAiCAMAAADid1KLAAAC/VBMVEVHmNotYXgwZHs0aH4sa4E5bIMxb4U7boUucZM1cIw8b4Y3cY09cIc6cJNHcIg1dJxFcoQ0dpc3dZ05dKNOcYQ+dJcyd6tCdZ8yeqc7eKFYc4hSdYlUdI41eq5Ld5tddIRMeYs4fLA/fKUwf7k7frJhd4hIfo9LfZROfolod4lce4pCgpJjeYo+gLU1grw8grBqfYh2eohhgI9UhJBIiJhCh7Vbg508ir5rgZI/isR+fog8jbqDfYhVia05js+JgIaLgohFkcU/ktNijqFSkbNkjaZ0i4+IhoqDiItUlKSUhIyMhZyXhIY5mN5TlbFokapGl9iah4mViYk8nNybiIt+kZ1LncRkl7x2laRDnuWhjIldm76Kk45rm6dXn8GHk7mqjo1LpNFsnbZIpOWJmJ6vkIppoL6UmZu3kY1Aq+qRmbpYqNBNqeluodm7k4mJncGknJVaquZorcNTsOporNWwn5SZpqalpZzAnpJssNmMqdl2s9fToI2tqpupq6hwt9rToZRivOLTppG/q5t5utdiwPS3r6iptKNYxPaSurzXq5VtwvBjxfG5tLPCs66Sv9NlyvBkzey+uLfVtpyJxerOuKJi0PvetpjjtZ9s0fdv0/nevJx60vrPwa+TzuaH0u6Z0O/lwqLbxK2Y0+y4zsDixLDTyLvWybaV2fCj1e/xxqKv0+mE4P/Tzs3wy6XK1cLe0b6Z4vKP5P+W5Oyw3vLr1L2o4/uq5fCi5/781aj116/v18Gb6v+Y7Pq64/Ll2s2h6vq26PW55/u56+vr4NPK5/Hy4ra27f/y4NTu4tWu8vzy5NH75Lm/8f775sHi7OfP8P//59Dv69z568TU8fva89b47eDR+ObD+v/978jf8//T+ujM+v/Q++7w9dfO/Pbb+urn+N3S/P3m9/3/9NPM///88+z+9dnr++Di+//6+Nv9+NXp+v/d//Xk/vXz/OP/+eT/+PHo//D1+v3o/v3v/P37/OX8+v7x//P3/f/y/////e7+/fP8/+/9//wrsYRgAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfeCxEQLAq+V/fUAAAC50lEQVRYw2NgYGBmHOSAhQEIGJlZ2QY1YGVmZGBgYmYb9ICZi4Fx8LuSjYVpSDiTjXHUmaPOHHXmCHSmYP2Vf8+WGRCp2+meJtE2qdz1wSKq/MCBo8iDVGdydn+oc047dE6eXs6U7NTh31vDTqIzxW40cbGx6d7PoJczgYAsZ04HOpPbU4tNct6bP8tVwYKK1+MPzuaCCshez9ry67Q7G7v1vn9Hqu5pokiCIyT7yr9rBVx6D+zZ2DPPiEDkoc7EVKZ823vPv3+rkA0gJtJ7/p0oMwKayr9pd2j08V0iYGc+Oj/JDSYg+/RSuu2OXXy6d7ZGVH55rYkiCVJt+a7Pf8orQ7gzQfJQZ2JRpnzbQehAAw+yDJcJD7cxF/4sxB23+uu/a+U8dg8N2djsXtiAnfm0i4sNJiD7tImLPfmyVPETTTbODqAzkSVBqn1fWbEJxkrDnQmSh0Y6FmVAZ4IiHVmGc8IiuY3NPIQKJG6Xlf8qcv59//z5599AsDPvRrGxwwRk7yewsUVelpm5E2hQwCtNFEmQaoltf9aWSbPBnQmUhzrTC4syiDO5kGXYhOZP1t+eh8+Z5ktAeZx3zc7Cmxbq6upqAhBnBgJthArIAjkgZ04DOxOYNpElId7067/w3ArkTK5ikDMD4c7EogzqTBQZyRWTTQ+n4nOm5dsEdlDCXOf03p6NzXG9PMyZbDABqDMhkd76WhNFEpSywtr52IRPNek98GLjmIXiTB8syqCRjmwd58Sp4ptLufA5k3fO796IpAXfgvj3XEwJP7uQB+5MmADMmeAs9PKJJookSHXwjzbX6k+psjeWmpXcQnUmFmUgZ+6ZoYAsw6XNxa1BIAuJthz99XF/DBeb0uKvH+dKs8GdCROAORNUIJ3Mv6qJIgkCHPWP/12r5eFMvPJnQ+4xFGdiUQZ0Jmfj14VcSDKjTY9RZ446c9SZo86kijNZB78rWZkYGIfCUBcrwxBwJ2jgcGgMwwIAr63+TOJfjTUAAAAASUVORK5CYII=");
d.css("padding","5px");
var e=$("<a></a>").attr({href:b.getModel().getUrl(),alt:"Open in new window ...",target:"_blank"});
e.append(d);
c.append(e);
a.append(c);
return a
}});mindplot.widget.KeyboardShortcutTooltip=new Class({Extends:mindplot.widget.FloatingTip,initialize:function(a,d){$assert(a,"buttonElem can not be null");
$assert(d,"text can not be null");
this._text=d;
var b=a.children().first();
var c=a.attr("id")+"Tip";
var e=$("<div></div>").attr("id",c);
e.append(b);
a.append(e);
this.parent(e,{content:this._buildContent(),html:true,placement:"bottom",className:"keyboardShortcutTip",template:'<div class="popover popoverBlack" role="tooltip"><div class="arrow arrowBlack"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});
e.on("click",function(f){e.trigger("mouseleave",f)
})
},_buildContent:function(){var a=$("<div></div>");
a.css({padding:"3px 0px",width:"100%",color:"white"});
var b=$("<div></div>").text(this._text);
b.css({width:"100%","font-size":"90%",textAlign:"center","font-weight":"bold"});
a.append(b);
return a
}});mindplot.widget.ColorPalettePanel=new Class({Extends:mindplot.widget.ToolbarPaneItem,initialize:function(b,a,c){this._baseUrl=c;
this.parent(b,a);
$assert($defined(c),"baseUrl can not be null")
},_load:function(){if(!mindplot.widget.ColorPalettePanel._panelContent){$("<link>").appendTo($("head")).attr({type:"text/css",rel:"stylesheet"}).attr("href",this._baseUrl+"/colorPalette.css");
var a;
$.ajax({url:this._baseUrl+"/colorPalette.html",method:"get",async:false,success:function(b){a=b
},error:function(){a="<div>Sorry, your request failed :(</div>"
}});
mindplot.widget.ColorPalettePanel._panelContent=a
}return mindplot.widget.ColorPalettePanel._panelContent
},buildPanel:function(){var c=$('<div class="toolbarPanel"></div>').attr("id",this._buttonId+"colorPalette");
c.html(this._load());
var d=c.find("div[class=palette-colorswatch]");
var a=this.getModel();
var b=this;
_.each(d,function(e){$(e).on("click",function(){var f=$(e).css("background-color");
a.setValue(f);
b.hide()
})
});
return c
},_updateSelectedItem:function(){var b=this.getPanelElem();
b.find("td[class='palette-cell palette-cell-selected']").attr("class","palette-cell");
var d=b.find("div[class=palette-colorswatch]");
var c=this.getModel();
var a=c.getValue();
_.each(d,function(f){var e=$(f).css("background-color").rgbToHex();
if(a!=null&&a[0]=="r"){a=a.rgbToHex()
}if(a!=null&&a.toUpperCase()==e.toUpperCase()){$(f).parent().attr("class","palette-cell palette-cell-selected")
}});
return b
}});mindplot.widget.ListToolbarPanel=new Class({Extends:mindplot.widget.ToolbarPaneItem,initialize:function(b,a){this.parent(b,a);
this._initPanel()
},_initPanel:function(){var a=this;
this.getPanelElem().children("div").bind("click",function(b){b.stopPropagation();
a.hide();
var c=$defined($(this).attr("model"))?$(this).attr("model"):$(this).attr("id");
a.getModel().setValue(c)
})
},_updateSelectedItem:function(){var a=this.getPanelElem();
var b=a.find("div");
var c=this.getModel().getValue();
_.each(b,function(e){var d=$defined($(e).attr("model"))?$(e).attr("model"):$(e).attr("id");
$assert(d,"elemValue can not be null");
if(d==c){$(e).attr("class","toolbarPanelLinkSelectedLink")
}else{$(e).attr("class","toolbarPanelLink")
}});
return a
}});mindplot.widget.FontFamilyPanel=new Class({Extends:mindplot.widget.ListToolbarPanel,initialize:function(b,a){this.parent(b,a)
},buildPanel:function(){var a=$("<div class='toolbarPanel' id='fontFamilyPanel'></div>");
a.html('<div id="times" model="Times" class="toolbarPanelLink" style="font-family:times;">Times</div><div id="arial"  model="Arial" style="font-family:arial;">Arial</div><div id="tahoma" model="Tahoma" style="font-family:tahoma;">Tahoma</div><div id="verdana" model="Verdana" style="font-family:verdana;">Verdana</div>');
return a
}});mindplot.widget.FontSizePanel=new Class({Extends:mindplot.widget.ListToolbarPanel,initialize:function(b,a){this.parent(b,a)
},buildPanel:function(){var a=$("<div class='toolbarPanel' id='fontSizePanel'></div>");
a[0].innerHTML='<div id="small" model="6" style="font-size:8px">Small</div><div id="normal" model="8" style="font-size:12px">Normal</div><div id="large" model="10" style="font-size:15px">Large</div><div id="huge"  model="15" style="font-size:24px">Huge</div>';
return a
}});mindplot.widget.TopicShapePanel=new Class({Extends:mindplot.widget.ListToolbarPanel,initialize:function(b,a){this.parent(b,a)
},buildPanel:function(){var a=$("<div class='toolbarPanel' id='topicShapePanel'></div>");
a[0].innerHTML='<div id="rectagle" model="rectagle"><img src="images/shape-rectangle.png" alt="Rectangle"></div><div id="rounded_rectagle" model="rounded rectagle" ><img src="images/shape-rectangle-round.png" alt="Rounded Rectangle"></div><div id="line" model="line"><img src="images/shape-line.png" alt="Line"></div><div id="elipse" model="elipse"><img src="images/shape-circle.png"></div>';
return a
}});mindplot.widget.IconPanel=new Class({Extends:mindplot.widget.ToolbarPaneItem,initialize:function(b,a){this.parent(b,a)
},_updateSelectedItem:function(){return this.getPanelElem()
},buildPanel:function(){var g=$('<div class="toolbarPanel" id="IconsPanel"></div>').css({width:245,height:230});
g.on("click",function(i){i.stopPropagation()
});
var f=0;
for(var c=0;
c<mindplot.ImageIcon.prototype.ICON_FAMILIES.length;
c=c+1){var l=mindplot.ImageIcon.prototype.ICON_FAMILIES[c].icons;
for(var b=0;
b<l.length;
b=b+1){var h;
if((f%12)==0){h=$("<div></div>");
g.append(h)
}var k=l[b];
var d=$("<img>").attr("id",k).attr("src",mindplot.ImageIcon.prototype._getImageUrl(k)).attr("class","panelIcon");
h.append(d);
var a=this;
var e=this.getModel();
d.on("click",function(i){e.setValue($(this).attr("id"));
a.hide()
});
f=f+1
}}return g
}});mindplot.widget.IMenu=new Class({initialize:function(c,a,b){$assert(c,"designer can not be null");
$assert(a,"containerId can not be null");
this._designer=c;
this._toolbarElems=[];
this._containerId=a;
this._mapId=b;
this._mindmapUpdated=false;
var d=this;
this._designer.addEvent("modelUpdate",function(){d.setRequireChange(true)
})
},clear:function(){_.each(this._toolbarElems,function(a){a.hide()
})
},discardChanges:function(b){this.setRequireChange(false);
var c=mindplot.PersistenceManager.getInstance();
var a=b.getMindmap();
c.discardChanges(a.getId());
this.unlockMap(b);
window.location.reload()
},unlockMap:function(b){var a=b.getMindmap();
var c=mindplot.PersistenceManager.getInstance();
c.unlockMap(a)
},save:function(h,b,f,c){var a=b.getMindmap();
var e=b.getMindmapProperties();
if(f){$notify($msg("SAVING"));
h.css("cursor","wait")
}var g=this;
var d=mindplot.PersistenceManager.getInstance();
d.save(a,e,f,{onSuccess:function(){if(f){h.css("cursor","pointer");
$notify($msg("SAVE_COMPLETE"))
}g.setRequireChange(false)
},onError:function(i){if(f){h.css("cursor","pointer");
if(i.severity!="FATAL"){$notify(i.message)
}else{$notifyModal(i.message)
}}}},c)
},isSaveRequired:function(){return this._mindmapUpdated
},setRequireChange:function(a){this._mindmapUpdated=a
}});mindplot.widget.Menu=new Class({Extends:mindplot.widget.IMenu,initialize:function(H,v,j,A,d){this.parent(H,v,j);
d=!$defined(d)?"":d;
var c=d+"css/widget";
$("#"+this._containerId).bind("click",function(J){J.stopPropagation();
return false
});
$("#"+this._containerId).bind("dblclick",function(J){J.stopPropagation();
return false
});
var o=H.getModel();
var l=$("#fontFamily");
if(l){var h={getValue:function(){var L=o.filterSelectedTopics();
var K=null;
for(var M=0;
M<L.length;
M++){var J=L[M].getFontFamily();
if(K!=null&&K!=J){K=null;
break
}K=J
}return K
},setValue:function(J){H.changeFontFamily(J)
}};
this._toolbarElems.push(new mindplot.widget.FontFamilyPanel("fontFamily",h));
this._registerTooltip("fontFamily",$msg("FONT_FAMILY"))
}var k=$("#fontSize");
if(k){var m={getValue:function(){var K=o.filterSelectedTopics();
var J=null;
for(var L=0;
L<K.length;
L++){var M=K[L].getFontSize();
if(J!=null&&J!=M){J=null;
break
}J=M
}return J
},setValue:function(J){H.changeFontSize(J)
}};
this._toolbarElems.push(new mindplot.widget.FontSizePanel("fontSize",m));
this._registerTooltip("fontSize",$msg("FONT_SIZE"))
}var t=$("#topicShape");
if(t){var n={getValue:function(){var K=o.filterSelectedTopics();
var J=null;
for(var L=0;
L<K.length;
L++){var M=K[L].getShapeType();
if(J!=null&&J!=M){J=null;
break
}J=M
}return J
},setValue:function(J){H.changeTopicShape(J)
}};
this._toolbarElems.push(new mindplot.widget.TopicShapePanel("topicShape",n));
this._registerTooltip("topicShape",$msg("TOPIC_SHAPE"))
}var C=$("#topicIcon");
if(C){var f={getValue:function(){return null
},setValue:function(J){H.addIconType(J)
}};
this._toolbarElems.push(new mindplot.widget.IconPanel("topicIcon",f));
this._registerTooltip("topicIcon",$msg("TOPIC_ICON"))
}var D=$("#topicColor");
if(D){var q={getValue:function(){var L=o.filterSelectedTopics();
var J=null;
for(var M=0;
M<L.length;
M++){var K=L[M].getBackgroundColor();
if(J!=null&&J!=K){J=null;
break
}J=K
}return J
},setValue:function(J){H.changeBackgroundColor(J)
}};
this._toolbarElems.push(new mindplot.widget.ColorPalettePanel("topicColor",q,c));
this._registerTooltip("topicColor",$msg("TOPIC_COLOR"))
}var B=$("#topicBorder");
if(B){var e={getValue:function(){var L=o.filterSelectedTopics();
var J=null;
for(var M=0;
M<L.length;
M++){var K=L[M].getBorderColor();
if(J!=null&&J!=K){J=null;
break
}J=K
}return J
},setValue:function(J){H.changeBorderColor(J)
}};
this._toolbarElems.push(new mindplot.widget.ColorPalettePanel("topicBorder",e,c));
this._registerTooltip("topicBorder",$msg("TOPIC_BORDER_COLOR"))
}var z=$("#fontColor");
if(z){var I={getValue:function(){var J=null;
var L=o.filterSelectedTopics();
for(var M=0;
M<L.length;
M++){var K=L[M].getFontColor();
if(J!=null&&J!=K){J=null;
break
}J=K
}return J
},setValue:function(J){H.changeFontColor(J)
}};
this._toolbarElems.push(new mindplot.widget.ColorPalettePanel("fontColor",I,d));
this._registerTooltip("fontColor",$msg("FONT_COLOR"))
}this._addButton("export",false,false,function(){BootstrapDialog.Request.active=new BootstrapDialog.Request("c/maps/"+j+"/exportf",$msg("EXPORT"),{cancelButton:true,closeButton:true})
});
this._registerTooltip("export",$msg("EXPORT"));
var F=this;
this._addButton("print",false,false,function(){F.save(r,H,false);
var J=window.location.href.substring(0,window.location.href.lastIndexOf("c/maps/"));
window.open(J+"c/maps/"+j+"/print")
});
this._registerTooltip("print",$msg("PRINT"));
this._addButton("zoomIn",false,false,function(){H.zoomIn()
});
this._registerTooltip("zoomIn",$msg("ZOOM_IN"));
this._addButton("zoomOut",false,false,function(){H.zoomOut()
});
this._registerTooltip("zoomOut",$msg("ZOOM_OUT"));
var b=this._addButton("undoEdition",false,false,function(){H.undo()
});
if(b){b.disable()
}this._registerTooltip("undoEdition",$msg("UNDO"),"meta+Z");
var G=this._addButton("redoEdition",false,false,function(){H.redo()
});
if(G){G.disable()
}this._registerTooltip("redoEdition",$msg("REDO"),"meta+shift+Z");
if(G&&b){H.addEvent("modelUpdate",function(J){if(J.undoSteps>0){b.enable()
}else{b.disable()
}if(J.redoSteps>0){G.enable()
}else{G.disable()
}})
}this._addButton("addTopic",true,false,function(){H.createSiblingForSelectedNode()
});
this._registerTooltip("addTopic",$msg("ADD_TOPIC"),"Enter");
this._addButton("deleteTopic",true,true,function(){H.deleteSelectedEntities()
});
this._registerTooltip("deleteTopic",$msg("TOPIC_DELETE"),"Delete");
this._addButton("topicLink",true,false,function(){H.addLink()
});
this._registerTooltip("topicLink",$msg("TOPIC_LINK"));
this._addButton("topicRelation",true,false,function(J){H.showRelPivot(J)
});
this._registerTooltip("topicRelation",$msg("TOPIC_RELATIONSHIP"));
this._addButton("topicNote",true,false,function(){H.addNote()
});
this._registerTooltip("topicNote",$msg("TOPIC_NOTE"));
this._addButton("fontBold",true,false,function(){H.changeFontWeight()
});
this._registerTooltip("fontBold",$msg("FONT_BOLD"),"meta+B");
this._addButton("fontItalic",true,false,function(){H.changeFontStyle()
});
this._registerTooltip("fontItalic",$msg("FONT_ITALIC"),"meta+I");
var r=$("#save");
if(r){this._addButton("save",false,false,function(){F.save(r,H,true)
});
this._registerTooltip("save",$msg("SAVE"),"meta+S");
if(!A){$(window).bind("unload",function(){if(F.isSaveRequired()){F.save(r,H,false,true)
}F.unlockMap(H)
});
setInterval(function(){if(F.isSaveRequired()){F.save(r,H,false)
}},30000)
}}var p=$("#discard");
if(p){this._addButton("discard",false,false,function(){F.discardChanges(H)
});
this._registerTooltip("discard",$msg("DISCARD_CHANGES"))
}var E=$("#shareIt");
if(E){this._addButton("shareIt",false,false,function(){BootstrapDialog.Request.active=new BootstrapDialog.Request("c/maps/"+j+"/sharef",$msg("COLLABORATE"),{closeButton:true,cancelButton:true});
H.onObjectFocusEvent()
});
this._registerTooltip("shareIt",$msg("COLLABORATE"))
}var a=$("#publishIt");
if(a){this._addButton("publishIt",false,false,function(){BootstrapDialog.Request.active=new BootstrapDialog.Request("c/maps/"+j+"/publishf",$msg("PUBLISH"),{closeButton:true,cancelButton:true});
H.onObjectFocusEvent()
});
this._registerTooltip("publishIt",$msg("PUBLISH"))
}var y=$("#history");
if(y){this._addButton("history",false,false,function(){BootstrapDialog.Request.active=new BootstrapDialog.Request("c/maps/"+j+"/historyf",$msg("HISTORY"),{closeButton:true,cancelButton:true});
H.onObjectFocusEvent()
});
this._registerTooltip("history",$msg("HISTORY"))
}this._registerEvents(H);
var i=$("#keyboardShortcuts");
if(i){i.bind("click",function(J){BootstrapDialog.Request.active=new BootstrapDialog.Request("c/keyboard",$msg("SHORTCUTS"),{closeButton:true,cancelButton:true});
H.onObjectFocusEvent();
J.preventDefault()
})
}var x=$("#tutorialVideo");
if(x){var w=900;
var u=500;
var g=(screen.width/2)-(w/2);
var s=(screen.height/2)-(u/2);
x.bind("click",function(J){window.open("https://www.framatube.org/media/tutoriel-video-wisemapping-claire-cassaigne/embed_player","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width="+w+", height="+u+", top="+s+", left="+g);
J.preventDefault()
})
}},_registerEvents:function(a){var b=this;
_.each(this._toolbarElems,function(c){c.addEvent("show",function(){b.clear()
})
});
a.addEvent("onblur",function(){var d=a.getModel().filterSelectedTopics();
var c=a.getModel().filterSelectedRelationships();
_.each(b._toolbarElems,function(g){var f=g.isTopicAction();
var e=g.isRelAction();
if(f||e){if((f&&d.length!=0)||(e&&c.length!=0)){g.enable()
}else{g.disable()
}}})
});
a.addEvent("onfocus",function(){var d=a.getModel().filterSelectedTopics();
var c=a.getModel().filterSelectedRelationships();
_.each(b._toolbarElems,function(g){var f=g.isTopicAction();
var e=g.isRelAction();
if(f||e){if(f&&d.length>0){g.enable()
}if(e&&c.length>0){g.enable()
}}})
})
},_addButton:function(f,c,b,e){var g=this;
var a=null;
if($("#"+f)){var d=new mindplot.widget.ToolbarItem(f,function(h){e(h);
g.clear()
},{topicAction:c,relAction:b});
this._toolbarElems.push(d);
a=d
}return a
},_registerTooltip:function(b,d,a){if($("#"+b)){var c=d;
if(a){a=Browser.Platform.mac?a.replace("meta+","⌘"):a.replace("meta+","ctrl+");
c=c+" ("+a+")"
}new mindplot.widget.KeyboardShortcutTooltip($("#"+b),c)
}}});mindplot.layout.EventBusDispatcher=new Class({initialize:function(){this.registerBusEvents()
},setLayoutManager:function(a){this._layoutManager=a
},registerBusEvents:function(){mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeAdded,this._nodeAdded.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeRemoved,this._nodeRemoved.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeResizeEvent,this._nodeResizeEvent.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeMoveEvent,this._nodeMoveEvent.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeDisconnectEvent,this._nodeDisconnectEvent.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeConnectEvent,this._nodeConnectEvent.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.NodeShrinkEvent,this._nodeShrinkEvent.bind(this));
mindplot.EventBus.instance.addEvent(mindplot.EventBus.events.DoLayout,this._doLayout.bind(this))
},_nodeResizeEvent:function(a){this._layoutManager.updateNodeSize(a.node.getId(),a.size)
},_nodeMoveEvent:function(a){this._layoutManager.moveNode(a.node.getId(),a.position)
},_nodeDisconnectEvent:function(a){this._layoutManager.disconnectNode(a.getId())
},_nodeConnectEvent:function(a){this._layoutManager.connectNode(a.parentNode.getId(),a.childNode.getId(),a.childNode.getOrder())
},_nodeShrinkEvent:function(a){this._layoutManager.updateShrinkState(a.getId(),a.areChildrenShrunken())
},_nodeAdded:function(a){if(a.getId()!=0){this._layoutManager.addNode(a.getId(),{width:10,height:10},a.getPosition());
this._layoutManager.updateShrinkState(a.getId(),a.areChildrenShrunken())
}},_nodeRemoved:function(a){this._layoutManager.removeNode(a.getId())
},_doLayout:function(){this._layoutManager.layout(true)
},getLayoutManager:function(){return this._layoutManager
}});mindplot.layout.ChangeEvent=new Class({initialize:function(a){$assert(!isNaN(a),"id can not be null");
this._id=a;
this._position=null;
this._order=null
},getId:function(){return this._id
},getOrder:function(){return this._order
},getPosition:function(){return this._position
},setOrder:function(a){$assert(!isNaN(a),"value can not be null");
this._order=a
},setPosition:function(a){$assert(a,"value can not be null");
this._position=a
},toString:function(){return"[order:"+this.getOrder()+", position: {"+this.getPosition().x+","+this.getPosition().y+"}]"
}});mindplot.layout.LayoutManager=new Class({Extends:mindplot.Events,initialize:function(d,b){$assert($defined(d),"rootNodeId can not be null");
$assert(b,"rootSize can not be null");
var a=a||{x:0,y:0};
this._treeSet=new mindplot.layout.RootedTreeSet();
this._layout=new mindplot.layout.OriginalLayout(this._treeSet);
var c=this._layout.createNode(d,b,a,"root");
this._treeSet.setRoot(c);
this._events=[]
},updateNodeSize:function(c,a){$assert($defined(c),"id can not be null");
var b=this._treeSet.find(c);
b.setSize(a)
},updateShrinkState:function(c,b){$assert($defined(c),"id can not be null");
$assert($defined(b),"value can not be null");
var a=this._treeSet.find(c);
a.setShrunken(b);
return this
},find:function(a){return this._treeSet.find(a)
},moveNode:function(c,a){$assert($defined(c),"id cannot be null");
$assert($defined(a),"position cannot be null");
$assert($defined(a.x),"x can not be null");
$assert($defined(a.y),"y can not be null");
var b=this._treeSet.find(c);
b.setPosition(a)
},connectNode:function(c,b,a){$assert($defined(c),"parentId cannot be null");
$assert($defined(b),"childId cannot be null");
$assert($defined(a),"order cannot be null");
this._layout.connectNode(c,b,a);
return this
},disconnectNode:function(a){$assert($defined(a),"id can not be null");
this._layout.disconnectNode(a);
return this
},addNode:function(d,c,b){$assert($defined(d),"id can not be null");
var a=this._layout.createNode(d,c,b,"topic");
this._treeSet.add(a);
return this
},removeNode:function(b){$assert($defined(b),"id can not be null");
var a=this._treeSet.find(b);
if(this._treeSet.getParent(a)){this.disconnectNode(b)
}this._treeSet.remove(b);
return this
},predict:function(h,f,b,e){$assert($defined(h),"parentId can not be null");
var c=this._treeSet.find(h);
var d=f?this._treeSet.find(f):null;
var g=c.getSorter();
var a=g.predict(this._treeSet,c,d,b,e);
return{order:a[0],position:a[1]}
},dump:function(){console.log(this._treeSet.dump())
},plot:function(a,c){$assert(a,"containerId cannot be null");
c=c||{width:200,height:200};
var d=10;
var b=Raphael(a,c.width,c.height);
b.drawGrid(0,0,c.width,c.height,c.width/d,c.height/d);
this._treeSet.plot(b);
return b
},layout:function(a){this._layout.layout();
this._collectChanges();
if($(a).length>0||a){this._flushEvents()
}return this
},_flushEvents:function(){_.each(this._events,function(a){this.fireEvent("change",a)
},this);
this._events=[]
},_collectChanges:function(a){if(!a){a=this._treeSet.getTreeRoots()
}_.each(a,function(c){if(c.hasOrderChanged()||c.hasPositionChanged()){var d=c.getId();
var b=this._events.some(function(e){return e.id==d
});
if(!b){b=new mindplot.layout.ChangeEvent(d)
}b.setOrder(c.getOrder());
b.setPosition(c.getPosition());
c.resetPositionState();
c.resetOrderState();
c.resetFreeState();
this._events.push(b)
}this._collectChanges(this._treeSet.getChildren(c))
},this)
}});mindplot.layout.Node=new Class({initialize:function(d,b,a,c){$assert(typeof d==="number"&&isFinite(d),"id can not be null");
$assert(b,"size can not be null");
$assert(a,"position can not be null");
$assert(c,"sorter can not be null");
this._id=d;
this._sorter=c;
this._properties={};
this.setSize(b);
this.setPosition(a);
this.setShrunken(false)
},getId:function(){return this._id
},setFree:function(a){this._setProperty("free",a)
},isFree:function(){return this._getProperty("free")
},hasFreeChanged:function(){return this._isPropertyChanged("free")
},hasFreeDisplacementChanged:function(){return this._isPropertyChanged("freeDisplacement")
},setShrunken:function(a){this._setProperty("shrink",a)
},areChildrenShrunken:function(){return this._getProperty("shrink")
},setOrder:function(a){$assert(typeof a==="number"&&isFinite(a),"Order can not be null. Value:"+a);
this._setProperty("order",a)
},resetPositionState:function(){var a=this._properties.position;
if(a){a.hasChanged=false
}},resetOrderState:function(){var a=this._properties.order;
if(a){a.hasChanged=false
}},resetFreeState:function(){var a=this._properties.freeDisplacement;
if(a){a.hasChanged=false
}},getOrder:function(){return this._getProperty("order")
},hasOrderChanged:function(){return this._isPropertyChanged("order")
},hasPositionChanged:function(){return this._isPropertyChanged("position")
},hasSizeChanged:function(){return this._isPropertyChanged("size")
},getPosition:function(){return this._getProperty("position")
},setSize:function(a){$assert($defined(a),"Size can not be null");
this._setProperty("size",Object.clone(a))
},getSize:function(){return this._getProperty("size")
},setFreeDisplacement:function(a){$assert($defined(a),"Position can not be null");
$assert($defined(a.x),"x can not be null");
$assert($defined(a.y),"y can not be null");
var b=this.getFreeDisplacement();
var c={x:b.x+a.x,y:b.y+a.y};
this._setProperty("freeDisplacement",Object.clone(c))
},resetFreeDisplacement:function(){this._setProperty("freeDisplacement",{x:0,y:0})
},getFreeDisplacement:function(){var a=this._getProperty("freeDisplacement");
return(a||{x:0,y:0})
},setPosition:function(a){$assert($defined(a),"Position can not be null");
$assert($defined(a.x),"x can not be null");
$assert($defined(a.y),"y can not be null");
var b=this.getPosition();
if(b==null||Math.abs(b.x-a.x)>2||Math.abs(b.y-a.y)>2){this._setProperty("position",a)
}},_setProperty:function(a,b){var c=this._properties[a];
if(!c){c={hasChanged:false,value:null,oldValue:null}
}if(JSON.stringify(c.value)!=JSON.stringify(b)){c.oldValue=c.value;
c.value=b;
c.hasChanged=true
}this._properties[a]=c
},_getProperty:function(a){var b=this._properties[a];
return $defined(b)?b.value:null
},_isPropertyChanged:function(a){var b=this._properties[a];
return b?b.hasChanged:false
},getSorter:function(){return this._sorter
},toString:function(){return"[id:"+this.getId()+", order:"+this.getOrder()+", position: {"+this.getPosition().x+","+this.getPosition().y+"}, size: {"+this.getSize().width+","+this.getSize().height+"}, shrink:"+this.areChildrenShrunken()+"]"
}});mindplot.layout.RootedTreeSet=new Class({initialize:function(){this._rootNodes=[]
},setRoot:function(a){$assert(a,"root can not be null");
this._rootNodes.push(this._decodate(a))
},getTreeRoots:function(){return this._rootNodes
},_decodate:function(a){a._children=[];
return a
},add:function(a){$assert(a,"node can not be null");
$assert(!this.find(a.getId(),false),"node already exits with this id. Id:"+a.getId());
$assert(!a._children,"node already added");
this._rootNodes.push(this._decodate(a))
},remove:function(b){$assert($defined(b),"nodeId can not be null");
var a=this.find(b);
this._rootNodes.erase(a)
},connect:function(d,b){$assert($defined(d),"parent can not be null");
$assert($defined(b),"child can not be null");
var a=this.find(d);
var c=this.find(b,true);
$assert(!c._parent,"node already connected. Id:"+c.getId()+",previous:"+c._parent);
a._children.push(c);
c._parent=a;
this._rootNodes.erase(c)
},disconnect:function(b){$assert($defined(b),"nodeId can not be null");
var a=this.find(b);
$assert(a._parent,"Node is not connected");
a._parent._children.erase(a);
this._rootNodes.push(a);
a._parent=null
},find:function(f,e){$assert($defined(f),"id can not be null");
var b=this._rootNodes;
var a=null;
for(var c=0;
c<b.length;
c++){var d=b[c];
a=this._find(f,d);
if(a){break
}}e=!$defined(e)?true:e;
$assert(e?a:true,"node could not be found id:"+f+"\n,RootedTreeSet"+this.dump());
return a
},_find:function(f,d){if(d.getId()==f){return d
}var a=null;
var c=d._children;
for(var b=0;
b<c.length;
b++){var e=c[b];
a=this._find(f,e);
if(a){break
}}return a
},getChildren:function(a){$assert(a,"node cannot be null");
return a._children
},getRootNode:function(b){$assert(b,"node cannot be null");
var a=this.getParent(b);
if($defined(a)){return this.getRootNode(a)
}return b
},getAncestors:function(a){$assert(a,"node cannot be null");
return this._getAncestors(this.getParent(a),[])
},_getAncestors:function(c,b){var a=b;
if(c){a.push(c);
this._getAncestors(this.getParent(c),a)
}return a
},getSiblings:function(a){$assert(a,"node cannot be null");
if(!$defined(a._parent)){return[]
}var b=a._parent._children.filter(function(c){return c!=a
});
return b
},hasSinglePathToSingleLeaf:function(a){$assert(a,"node cannot be null");
return this._hasSinglePathToSingleLeaf(a)
},_hasSinglePathToSingleLeaf:function(b){var a=this.getChildren(b);
if(a.length==1){return this._hasSinglePathToSingleLeaf(a[0])
}return a.length==0
},isStartOfSubBranch:function(a){return this.getSiblings(a).length>0&&this.getChildren(a).length==1
},isLeaf:function(a){$assert(a,"node cannot be null");
return this.getChildren(a).length==0
},getParent:function(a){$assert(a,"node cannot be null");
return a._parent
},dump:function(){var b=this._rootNodes;
var a="";
for(var c=0;
c<b.length;
c++){var d=b[c];
a+=this._dump(d,"")
}return a
},_dump:function(e,b){var a=b+e+"\n";
var d=this.getChildren(e);
for(var c=0;
c<d.length;
c++){var f=d[c];
a+=this._dump(f,b+"   ")
}return a
},plot:function(b){var a=this._rootNodes;
for(var c=0;
c<a.length;
c++){var d=a[c];
this._plot(b,d)
}},_plot:function(d,e,m){var c=this.getChildren(e);
var h=e.getPosition().x+d.width/2-e.getSize().width/2;
var g=e.getPosition().y+d.height/2-e.getSize().height/2;
var l=d.rect(h,g,e.getSize().width,e.getSize().height);
var f=e.getOrder()==null?"r":e.getOrder();
var o=d.text(e.getPosition().x+d.width/2,e.getPosition().y+d.height/2,e.getId()+"["+f+"]");
o.attr("fill","#FFF");
var a=this._rootNodes.contains(e)?"#000":(e.isFree()?"#abc":"#c00");
l.attr("fill",a);
var k={x:l.attr("x")-d.width/2+l.attr("width")/2,y:l.attr("y")-d.height/2+l.attr("height")/2};
var n={width:l.attr("width"),height:l.attr("height")};
l.click(function(){console.log("[id:"+e.getId()+", order:"+e.getOrder()+", position:("+k.x+","+k.y+"), size:"+n.width+"x"+n.height+", freeDisplacement:("+e.getFreeDisplacement().x+","+e.getFreeDisplacement().y+")]")
});
o.click(function(){console.log("[id:"+e.getId()+", order:"+e.getOrder()+", position:("+k.x+","+k.y+"), size:"+n.width+"x"+n.height+", freeDisplacement:("+e.getFreeDisplacement().x+","+e.getFreeDisplacement().y+")]")
});
for(var j=0;
j<c.length;
j++){var b=c[j];
this._plot(d,b)
}},updateBranchPosition:function(f,a){var b=f.getPosition();
f.setPosition(a);
var d=b.x-a.x;
var g=b.y-a.y;
var c=this.getChildren(f);
var e=this;
_.each(c,function(h){e.shiftBranchPosition(h,d,g)
})
},shiftBranchPosition:function(e,c,f){var a=e.getPosition();
e.setPosition({x:a.x+c,y:a.y+f});
var b=this.getChildren(e);
var d=this;
_.each(b,function(g){d.shiftBranchPosition(g,c,f)
})
},getSiblingsInVerticalDirection:function(b,d){var a=this.getParent(b);
var c=this.getSiblings(b).filter(function(g){var f=b.getPosition().x>a.getPosition().x?g.getPosition().x>a.getPosition().x:g.getPosition().x<a.getPosition().x;
var e=d<0?g.getOrder()<b.getOrder():g.getOrder()>b.getOrder();
return e&&f
});
if(d<0){c.reverse()
}return c
},getBranchesInVerticalDirection:function(d,f){var b=this.getRootNode(d);
var a=this.getChildren(b).filter(function(g){return this._find(d.getId(),g)
},this);
var c=a[0];
var e=this.getSiblings(c).filter(function(h){var g=d.getPosition().x>b.getPosition().x?h.getPosition().x>b.getPosition().x:h.getPosition().x<b.getPosition().x;
var i=f<0?h.getOrder()<c.getOrder():h.getOrder()>c.getOrder();
return g&&i
},this);
return e
}});mindplot.layout.ChildrenSorterStrategy=new Class({initialize:function(){},computeChildrenIdByHeights:function(b,a){throw"Method must be implemented"
},computeOffsets:function(b,a){throw"Method must be implemented"
},insert:function(c,b,d,a){throw"Method must be implemented"
},detach:function(b,a){throw"Method must be implemented"
},predict:function(d,b,c,a,e){throw"Method must be implemented"
},verify:function(b,a){throw"Method must be implemented"
},getChildDirection:function(b,a){throw"Method must be implemented"
},toString:function(){throw"Method must be implemented: print name"
}});mindplot.layout.AbstractBasicSorter=new Class({Extends:mindplot.layout.ChildrenSorterStrategy,computeChildrenIdByHeights:function(c,b){var a={};
this._computeChildrenHeight(c,b,a);
return a
},_getVerticalPadding:function(){return mindplot.layout.AbstractBasicSorter.INTERNODE_VERTICAL_PADDING
},_computeChildrenHeight:function(g,f,c){var b=f.getSize().height+(this._getVerticalPadding()*2);
var a;
var e=g.getChildren(f);
if(e.length==0||f.areChildrenShrunken()){a=b
}else{var d=0;
_.each(e,function(h){d+=this._computeChildrenHeight(g,h,c)
},this);
a=Math.max(b,d)
}if(c){c[f.getId()]=a
}return a
},_getSortedChildren:function(c,b){var a=c.getChildren(b);
a.sort(function(e,d){return e.getOrder()-d.getOrder()
});
return a
},_getRelativeDirection:function(b,a){var c=a.x-b.x;
return c>=0?1:-1
}});
mindplot.layout.AbstractBasicSorter.INTERNODE_VERTICAL_PADDING=5;
mindplot.layout.AbstractBasicSorter.INTERNODE_HORIZONTAL_PADDING=30;mindplot.layout.BalancedSorter=new Class({Extends:mindplot.layout.AbstractBasicSorter,initialize:function(){},predict:function(a,h,n,t,m){if(m){$assert($defined(t),"position cannot be null for predict in free positioning");
$assert($defined(n),"node cannot be null for predict in free positioning");
var q=a.getRootNode(h);
var r=this._getRelativeDirection(q.getPosition(),n.getPosition());
var l=h.getPosition().x+r*(h.getSize().width/2+n.getSize().width/2+mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING);
var k=r>0?(t.x>=l?t.x:l):(t.x<=l?t.x:l);
return[0,{x:k,y:t.y}]
}var q=a.getRootNode(h);
if(n){$assert($defined(t),"position cannot be null for predict in dragging");
var b=this._getRelativeDirection(q.getPosition(),n.getPosition());
var i=this._getRelativeDirection(q.getPosition(),t);
var f=a.getSiblings(n);
var s=h==a.getParent(n);
if(f.length==0&&b==i&&s){return[n.getOrder(),n.getPosition()]
}}if(!t){var p=this._getChildrenForOrder(h,a,0);
var c=this._getChildrenForOrder(h,a,1)
}var o=t?(t.x>q.getPosition().x?0:1):((p.length-c.length)>0?1:0);
var r=o%2==0?1:-1;
var d=this._getChildrenForOrder(h,a,o).filter(function(u){return u!=n
});
if(d.length==0){return[o,{x:h.getPosition().x+r*(h.getSize().width/2+mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING*2),y:h.getPosition().y}]
}var j=null;
var g=d.getLast();
t=t||{x:g.getPosition().x,y:g.getPosition().y+1};
_.each(d,function(w,u){var v=w.getPosition();
if(t.y>v.y){yOffset=w==g?w.getSize().height+mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING*2:(d[u+1].getPosition().y-w.getPosition().y)/2;
j=[w.getOrder()+2,{x:v.x,y:v.y+yOffset}]
}});
if(!j){var e=d[0];
j=[t.x>0?0:1,{x:e.getPosition().x,y:e.getPosition().y-e.getSize().height-mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING*2}]
}return j
},insert:function(g,j,a,d){var b=this._getChildrenForOrder(j,g,d);
if(b.length==0){a.setOrder(d%2);
return
}var h=0;
for(var e=0;
e<b.length;
e++){var c=b[e];
h=Math.max(h,c.getOrder());
if(c.getOrder()>=d){h=Math.max(h,c.getOrder()+2);
c.setOrder(c.getOrder()+2)
}}var f=d>(h+1)?(h+2):d;
a.setOrder(f)
},detach:function(d,c){var b=d.getParent(c);
var a=this._getChildrenForOrder(b,d,c.getOrder());
_.each(a,function(f,e){if(f.getOrder()>c.getOrder()){f.setOrder(f.getOrder()-2)
}});
c.setOrder(c.getOrder()%2==0?0:1)
},computeOffsets:function(j,c){$assert(j,"treeSet can no be null.");
$assert(c,"node can no be null.");
var b=this._getSortedChildren(j,c);
var k=b.map(function(i){return{id:i.getId(),order:i.getOrder(),width:i.getSize().width,height:this._computeChildrenHeight(j,i)}
},this).reverse();
var e=0;
var a=0;
_.each(k,function(i){if(i.order%2==0){e+=i.height
}else{a+=i.height
}});
var f=e/2;
var m=a/2;
var o=0;
var n={};
for(var g=0;
g<k.length;
g++){var l=k[g].order%2?-1:1;
if(l>0){f=f-k[g].height;
o=f
}else{m=m-k[g].height;
o=m
}var d=o+k[g].height/2;
var h=l*(c.getSize().width/2+k[g].width/2+ +mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING);
$assert(!isNaN(h),"xOffset can not be null");
$assert(!isNaN(d),"yOffset can not be null");
n[k[g].id]={x:h,y:d}
}return n
},verify:function(f,e){var d=this._getChildrenForOrder(e,f,e.getOrder());
var c=e.getOrder()%2==0?2:1;
for(var b=0;
b<d.length;
b++){var a=b==0&&c==1?1:(c*b);
$assert(d[b].getOrder()==a,"Missing order elements. Missing order: "+(b*c)+". Parent:"+e.getId()+",Node:"+d[b].getId())
}},getChildDirection:function(a,b){return b.getOrder()%2==0?1:-1
},toString:function(){return"Balanced Sorter"
},_getChildrenForOrder:function(b,c,a){return this._getSortedChildren(c,b).filter(function(d){return d.getOrder()%2==a%2
})
},_getVerticalPadding:function(){return mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING
}});
mindplot.layout.BalancedSorter.INTERNODE_VERTICAL_PADDING=5;
mindplot.layout.BalancedSorter.INTERNODE_HORIZONTAL_PADDING=30;mindplot.layout.SymmetricSorter=new Class({Extends:mindplot.layout.AbstractBasicSorter,initialize:function(){},predict:function(a,g,p,w,m){var n=this;
var t=a.getRootNode(g);
if(m){$assert($defined(w),"position cannot be null for predict in free positioning");
$assert($defined(p),"node cannot be null for predict in free positioning");
var u=this._getRelativeDirection(t.getPosition(),g.getPosition());
var l=g.getPosition().x+u*(g.getSize().width/2+p.getSize().width/2+mindplot.layout.SymmetricSorter.INTERNODE_HORIZONTAL_PADDING);
var k=u>0?(w.x>=l?w.x:l):(w.x<=l?w.x:l);
return[0,{x:k,y:w.y}]
}if(!p){var s=n._getRelativeDirection(t.getPosition(),g.getPosition());
var w={x:g.getPosition().x+s*(g.getSize().width+mindplot.layout.SymmetricSorter.INTERNODE_HORIZONTAL_PADDING),y:g.getPosition().y};
return[a.getChildren(g).length,w]
}$assert($defined(w),"position cannot be null for predict in dragging");
var c=this._getRelativeDirection(t.getPosition(),p.getPosition());
var h=this._getRelativeDirection(t.getPosition(),w);
var e=a.getSiblings(p);
var v=g==a.getParent(p);
if(e.length==0&&c==h&&v){return[p.getOrder(),p.getPosition()]
}var x=a.getChildren(g);
if(x.length==0){var w={x:g.getPosition().x+h*(g.getSize().width+mindplot.layout.SymmetricSorter.INTERNODE_HORIZONTAL_PADDING),y:g.getPosition().y};
return[0,w]
}else{var j=null;
var f=x.getLast();
for(var r=0;
r<x.length;
r++){var b=x[r];
var o=(r+1)==b.length?null:x[r+1];
if(!o&&w.y>b.getPosition().y){var q=(a.getParent(p)&&a.getParent(p).getId()==g.getId())?f.getOrder():f.getOrder()+1;
var w={x:b.getPosition().x,y:b.getPosition().y+b.getSize().height+mindplot.layout.SymmetricSorter.INTERNODE_VERTICAL_PADDING*2};
return[q,w]
}if(o&&w.y>b.getPosition().y&&w.y<o.getPosition().y){if(o.getId()==p.getId()||b.getId()==p.getId()){return[p.getOrder(),p.getPosition()]
}else{var q=w.y>p.getPosition().y?o.getOrder()-1:b.getOrder()+1;
var w={x:b.getPosition().x,y:b.getPosition().y+(o.getPosition().y-b.getPosition().y)/2};
return[q,w]
}}}}var d=x[0];
var w={x:d.getPosition().x,y:d.getPosition().y-d.getSize().height-mindplot.layout.SymmetricSorter.INTERNODE_VERTICAL_PADDING*2};
return[0,w]
},insert:function(f,d,g,a){var c=this._getSortedChildren(f,d);
$assert(a<=c.length,"Order must be continues and can not have holes. Order:"+a);
for(var b=a;
b<c.length;
b++){var e=c[b];
e.setOrder(b+1)
}g.setOrder(a)
},detach:function(f,e){var d=f.getParent(e);
var c=this._getSortedChildren(f,d);
var a=e.getOrder();
$assert(c[a]===e,"Node seems not to be in the right position");
for(var b=e.getOrder()+1;
b<c.length;
b++){var g=c[b];
g.setOrder(g.getOrder()-1)
}e.setOrder(0)
},computeOffsets:function(g,c){$assert(g,"treeSet can no be null.");
$assert(c,"node can no be null.");
var b=this._getSortedChildren(g,c);
var j=b.map(function(i){return{id:i.getId(),order:i.getOrder(),position:i.getPosition(),width:i.getSize().width,height:this._computeChildrenHeight(g,i)}
},this).reverse();
var h=0;
_.each(j,function(i){h+=i.height
});
var l=h/2;
var m={};
for(var e=0;
e<j.length;
e++){l=l-j[e].height;
var a=g.find(j[e].id);
var k=this.getChildDirection(g,a);
var d=l+j[e].height/2;
var f=k*(j[e].width/2+c.getSize().width/2+mindplot.layout.SymmetricSorter.INTERNODE_HORIZONTAL_PADDING);
$assert(!isNaN(f),"xOffset can not be null");
$assert(!isNaN(d),"yOffset can not be null");
m[j[e].id]={x:f,y:d}
}return m
},verify:function(d,c){var b=this._getSortedChildren(d,c);
for(var a=0;
a<b.length;
a++){$assert(b[a].getOrder()==a,"missing order elements")
}},getChildDirection:function(d,g){$assert(d,"treeSet can no be null.");
$assert(d.getParent(g),"This should not happen");
var a;
var b=d.getRootNode(g);
if(d.getParent(g)==b){a=Math.sign(b.getPosition().x)
}else{var c=d.getParent(g);
var e=d.getParent(c);
var f=e.getSorter();
a=f.getChildDirection(d,c)
}return a
},toString:function(){return"Symmetric Sorter"
},_getVerticalPadding:function(){return mindplot.layout.SymmetricSorter.INTERNODE_VERTICAL_PADDING
}});
mindplot.layout.SymmetricSorter.INTERNODE_VERTICAL_PADDING=5;
mindplot.layout.SymmetricSorter.INTERNODE_HORIZONTAL_PADDING=30;mindplot.layout.GridSorter=new Class({Extends:mindplot.layout.AbstractBasicSorter,computeOffsets:function(k,c){$assert(k,"treeSet can no be null.");
$assert(c,"node can no be null.");
$assert("order can no be null.");
var b=this._getSortedChildren(k,c);
var n=this;
var m=b.map(function(i){return{id:i.getId(),height:n._computeChildrenHeight(k,i)}
});
var p={};
for(var g=0;
g<m.length;
g++){var f=g%2==0?1:-1;
var l=g==0?0:m[0].height/2*f;
var o=0;
for(var e=g-2;
e>0;
e=e-2){o+=m[e].height*f
}var a=g==0?0:m[g].height/2*f;
var d=l+o+a;
var h=c.getSize().width+mindplot.layout.GridSorter.GRID_HORIZONTAR_SIZE;
$assert(!isNaN(h),"xOffset can not be null");
$assert(!isNaN(d),"yOffset can not be null");
p[m[g].id]={x:h,y:d}
}return p
},toString:function(){return"Grid Sorter"
}});
mindplot.layout.GridSorter.GRID_HORIZONTAR_SIZE=20;
mindplot.layout.GridSorter.INTER_NODE_VERTICAL_DISTANCE=50;mindplot.layout.OriginalLayout=new Class({initialize:function(a){this._treeSet=a
},createNode:function(e,b,a,c){$assert($defined(e),"id can not be null");
$assert(b,"size can not be null");
$assert(a,"position can not be null");
$assert(c,"type can not be null");
var d=c==="root"?mindplot.layout.OriginalLayout.BALANCED_SORTER:mindplot.layout.OriginalLayout.SYMMETRIC_SORTER;
return new mindplot.layout.Node(e,b,a,d)
},connectNode:function(f,c,a){var b=this._treeSet.find(f);
var e=this._treeSet.find(c);
var d=b.getSorter();
d.insert(this._treeSet,b,e,a);
this._treeSet.connect(f,c);
d.verify(this._treeSet,b)
},disconnectNode:function(c){var b=this._treeSet.find(c);
var a=this._treeSet.getParent(b);
$assert(a,"Node already disconnected");
b.setFree(false);
b.resetFreeDisplacement();
var d=a.getSorter();
d.detach(this._treeSet,b);
this._treeSet.disconnect(c);
a.getSorter().verify(this._treeSet,a)
},layout:function(){var a=this._treeSet.getTreeRoots();
_.each(a,function(c){var d=c.getSorter();
var b=d.computeChildrenIdByHeights(this._treeSet,c);
this._layoutChildren(c,b);
this._fixOverlapping(c,b)
},this)
},_layoutChildren:function(d,g){var c=d.getId();
var b=this._treeSet.getChildren(d);
var k=this._treeSet.getParent(d);
var i=b.some(function(o){return o.hasOrderChanged()
});
var l=b.some(function(o){return o.hasSizeChanged()
});
var e=g[c];
var a=$defined(k)?k._heightChanged:false;
var f=d._branchHeight!=e;
d._heightChanged=f||a;
if(i||l||f||a){var n=d.getSorter();
var m=n.computeOffsets(this._treeSet,d);
var j=d.getPosition();
var h=this;
_.each(b,function(u){var t=m[u.getId()];
var o=u.getFreeDisplacement();
var s=d.getSorter().getChildDirection(h._treeSet,u);
if((s>0&&o.x<0)||(s<0&&o.x>0)){u.resetFreeDisplacement();
u.setFreeDisplacement({x:-o.x,y:o.y})
}t.x+=u.getFreeDisplacement().x;
t.y+=u.getFreeDisplacement().y;
var r=j.x;
var q=j.y;
var p={x:r+t.x,y:q+t.y+h._calculateAlignOffset(d,u,g)};
h._treeSet.updateBranchPosition(u,p)
});
d._branchHeight=e
}_.each(b,function(o){this._layoutChildren(o,g)
},this)
},_calculateAlignOffset:function(c,f,b){if(f.isFree()){return 0
}var e=0;
var d=c.getSize().height;
var a=f.getSize().height;
if(this._treeSet.isStartOfSubBranch(f)&&this._branchIsTaller(f,b)){if(this._treeSet.hasSinglePathToSingleLeaf(f)){e=b[f.getId()]/2-(a+f.getSorter()._getVerticalPadding()*2)/2
}else{e=this._treeSet.isLeaf(f)?0:-(a-d)/2
}}else{if(d>a){if(this._treeSet.getSiblings(f).length>0){e=0
}else{e=d/2-a/2
}}else{if(a>d){if(this._treeSet.getSiblings(f).length>0){e=0
}else{e=-(a/2-d/2)
}}}}return e
},_branchIsTaller:function(b,a){return a[b.getId()]>(b.getSize().height+b.getSorter()._getVerticalPadding()*2)
},_fixOverlapping:function(c,b){var a=this._treeSet.getChildren(c);
if(c.isFree()){this._shiftBranches(c,b)
}_.each(a,function(d){this._fixOverlapping(d,b)
},this)
},_shiftBranches:function(f,d){var a=[f];
var b=this._treeSet.getSiblingsInVerticalDirection(f,f.getFreeDisplacement().y);
var e=f;
_.each(b,function(h){var g=a.some(function(j){return this._branchesOverlap(j,h,d)
},this);
if(!h.isFree()||g){var i=f.getFreeDisplacement().y;
this._treeSet.shiftBranchPosition(h,0,i);
a.push(h)
}},this);
var c=this._treeSet.getBranchesInVerticalDirection(f,f.getFreeDisplacement().y).filter(function(g){return !a.contains(g)
});
_.each(c,function(h){var g=f.getFreeDisplacement().y;
this._treeSet.shiftBranchPosition(h,0,g);
a.push(h);
e=h
},this)
},_branchesOverlap:function(g,f,d){if(g==f){return false
}var c=g.getPosition().y-d[g.getId()]/2;
var e=g.getPosition().y+d[g.getId()]/2;
var a=f.getPosition().y-d[f.getId()]/2;
var b=f.getPosition().y+d[f.getId()]/2;
return !(c>=b||e<=a)
}});
mindplot.layout.OriginalLayout.SYMMETRIC_SORTER=new mindplot.layout.SymmetricSorter();
mindplot.layout.OriginalLayout.BALANCED_SORTER=new mindplot.layout.BalancedSorter();mindplot.EventBus=new Class({Implements:mindplot.Events,initialize:function(){}});
mindplot.EventBus.events={NodeResizeEvent:"NodeResizeEvent",NodeMoveEvent:"NodeMoveEvent",NodeShrinkEvent:"NodeShrinkEvent",NodeConnectEvent:"NodeConnectEvent",NodeDisconnectEvent:"NodeDisconnectEvent",NodeAdded:"NodeAdded",NodeRemoved:"NodeRemoved",DoLayout:"DoLayout"};
mindplot.EventBus.instance=new mindplot.EventBus();mindplot.Messages.BUNDLES.en={ZOOM_IN:"Zoom In",ZOOM_OUT:"Zoom Out",TOPIC_SHAPE:"Topic Shape",TOPIC_ADD:"Add Topic",TOPIC_DELETE:"Delete Topic",TOPIC_ICON:"Add Icon",TOPIC_LINK:"Add Link",TOPIC_RELATIONSHIP:"Relationship",TOPIC_COLOR:"Topic Color",TOPIC_BORDER_COLOR:"Topic Border Color",TOPIC_NOTE:"Add Note",FONT_FAMILY:"Font Type",FONT_SIZE:"Text Size",FONT_BOLD:"Text Bold",FONT_ITALIC:"Text Italic",UNDO:"Undo",REDO:"Redo",INSERT:"Insert",SAVE:"Save",NOTE:"Note",ADD_TOPIC:"Add Topic",LOADING:"Loading ...",EXPORT:"Export",PRINT:"Print",PUBLISH:"Publish",COLLABORATE:"Share",HISTORY:"History",DISCARD_CHANGES:"Discard Changes",FONT_COLOR:"Text Color",SAVING:"Saving ...",SAVE_COMPLETE:"Save Complete",ZOOM_IN_ERROR:"Zoom too high.",ZOOM_ERROR:"No more zoom can be applied.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"Could not create a topic. Only one topic must be selected.",ONE_TOPIC_MUST_BE_SELECTED:"Could not create a topic. One topic must be selected.",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Children can not be collapsed. One topic must be selected.",SAVE_COULD_NOT_BE_COMPLETED:"Save could not be completed, please try again latter.",UNEXPECTED_ERROR_LOADING:"We're sorry, an unexpected error has occurred.\nTry again reloading the editor.If the problem persists, contact us to support@wisemapping.com.",MAIN_TOPIC:"Main Topic",SUB_TOPIC:"Sub Topic",ISOLATED_TOPIC:"Isolated Topic",CENTRAL_TOPIC:"Central Topic",SHORTCUTS:"Keyboard Shortcuts",ENTITIES_COULD_NOT_BE_DELETED:"Could not delete topic or relation. At least one map entity must be selected.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"At least one topic must be selected.",CLIPBOARD_IS_EMPTY:"Nothing to copy. Clipboard is empty.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"Central topic can not be deleted.",RELATIONSHIP_COULD_NOT_BE_CREATED:"Relationship could not be created. A parent relationship topic must be selected first.",SELECTION_COPIED_TO_CLIPBOARD:"Topics copied to the clipboard",WRITE_YOUR_TEXT_HERE:"Write your note here ...",REMOVE:"Remove",ACCEPT:"Accept",CANCEL:"Cancel",LINK:"Link",OPEN_LINK:"Open URL",SESSION_EXPIRED:"Your session has expired, please log-in again.",URL_ERROR:"URL not valid",DUMMY:""};mindplot.Messages.BUNDLES.es={DISCARD_CHANGES:"Descartar Cambios",SAVE:"Guardar",INSERT:"Insertar",ZOOM_IN:"Acercar",ZOOM_OUT:"Alejar",TOPIC_BORDER_COLOR:"Color del Borde",TOPIC_SHAPE:"Forma del Tópico",TOPIC_ADD:"Agregar Tópico",TOPIC_DELETE:"Borrar Tópico",TOPIC_ICON:"Agregar Icono",TOPIC_LINK:"Agregar Enlace",TOPIC_NOTE:"Agregar Nota",TOPIC_COLOR:"Color Tópico",TOPIC_RELATIONSHIP:"Relación",FONT_FAMILY:"Tipo de Fuente",FONT_SIZE:"Tamaño de Texto",FONT_BOLD:"Negrita",FONT_ITALIC:"Italica",FONT_COLOR:"Color de Texto",UNDO:"Rehacer",NOTE:"Nota",LOADING:"Cargando ...",PRINT:"Imprimir",PUBLISH:"Publicar",REDO:"Deshacer",ADD_TOPIC:"Agregar Tópico",COLLABORATE:"Compartir",EXPORT:"Exportar",HISTORY:"Historial",SAVE_COMPLETE:"Grabado Completo",SAVING:"Grabando ...",ONE_TOPIC_MUST_BE_SELECTED:"No ha sido posible crear un nuevo tópico. Al menos un tópico debe ser seleccionado.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"No ha sido posible crear un nuevo tópico. Sólo un tópico debe ser seleccionado.",SAVE_COULD_NOT_BE_COMPLETED:"Grabación no pudo ser completada. Intentelo mas tarde.",UNEXPECTED_ERROR_LOADING:"Lo sentimos, un error inesperado ha ocurrido. Intentelo nuevamente recargando el editor. Si el problema persiste, contactenos a support@wisemapping.com.",ZOOM_ERROR:"No es posible aplicar mas zoom.",ZOOM_IN_ERROR:"El zoom es muy alto.",MAIN_TOPIC:"Tópico Principal",SUB_TOPIC:"Tópico Secundario",ISOLATED_TOPIC:"Tópico Aislado",CENTRAL_TOPIC:"Tópico Central",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Tópicos hijos no pueden ser colapsados. Sólo un tópico debe ser seleccionado.",SHORTCUTS:"Accesos directos",ENTITIES_COULD_NOT_BE_DELETED:"El tópico o la relación no pudo ser borrada. Debe selecionar al menos una.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"Al menos un tópico debe ser seleccionado.",CLIPBOARD_IS_EMPTY:"Nada que copiar. Clipboard está vacio.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"El tópico central no puede ser borrado.",RELATIONSHIP_COULD_NOT_BE_CREATED:"La relación no pudo ser creada. Una relación padre debe ser seleccionada primero.",SELECTION_COPIED_TO_CLIPBOARD:"Tópicos copiados al clipboard",WRITE_YOUR_TEXT_HERE:"Escribe tu nota aquí ...",REMOVE:"Borrar",ACCEPT:"Aceptar",CANCEL:"Cancelar",LINK:"Enlace",OPEN_LINK:"Abrir Enlace",SESSION_EXPIRED:"Su session ha expirado. Por favor, ingrese nuevamente.",DUMMY:""};mindplot.Messages.BUNDLES.de={ZOOM_IN:"Ansicht vergrößern",ZOOM_OUT:"Ansicht verkleinern",TOPIC_SHAPE:"Themen Gestaltung",TOPIC_ADD:"Thema hinzufügen",TOPIC_DELETE:"Thema löschen",TOPIC_ICON:"Symbol hinzufügen",TOPIC_LINK:"Verbindung hinzufügen",TOPIC_RELATIONSHIP:"Beziehung",TOPIC_COLOR:"Themenfarbe",TOPIC_BORDER_COLOR:"Thema Randfarbe",TOPIC_NOTE:"Notiz hinzufügen",FONT_FAMILY:"Schrifttyp",FONT_SIZE:"Schriftgröße",FONT_BOLD:"Fette Schrift",FONT_ITALIC:"Kursive Schrift",UNDO:"Rückgängig machen",REDO:"Wiederholen",INSERT:"Einfügen",SAVE:"Sichern",NOTE:"Notiz",ADD_TOPIC:"Thema hinzufügen",LOADING:"Laden ...",EXPORT:"Exportieren",PRINT:"Drucken",PUBLISH:"Publizieren",COLLABORATE:"Mitbenutzen",HISTORY:"Historie",DISCARD_CHANGES:"Änderungen verwerfen",FONT_COLOR:"Textfarbe",SAVING:"Sichern ...",SAVE_COMPLETE:"Sichern abgeschlossen",ZOOM_IN_ERROR:"Zoom zu hoch.",ZOOM_ERROR:"Es kann nicht weiter vergrößert bzw. verkelinert werden.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"Thema konnte nicht angelegt werden. Bitte wählen Sie nur ein Thema aus.",ONE_TOPIC_MUST_BE_SELECTED:"Thema konnte nicht angelegt werden. Es muss ein Thema ausgewählt werden.",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Kinderknoten können nicht eingefaltet werden. Es muss ein Thema ausgewäht werden.",SAVE_COULD_NOT_BE_COMPLETED:"Sichern wurde nicht abgeschlossen. Versuchen Sie es später nocheinmal.",UNEXPECTED_ERROR_LOADING:"E tut uns Leid, ein unerwarteter Fehler ist aufgetreten.\nVersuchen Sie, den Editor neu zu laden. Falls das Problem erneut auftritt, bitte kontaktieren Sie uns unter support@wisemapping.com.",MAIN_TOPIC:"Hauptthema",SUB_TOPIC:"Unterthema",ISOLATED_TOPIC:"Isoliertes Thema",CENTRAL_TOPIC:"Zentrales Thema",SHORTCUTS:"Tastaturkürzel",ENTITIES_COULD_NOT_BE_DELETED:"Konnte das Thema oder die Beziehung nicht löschen. Es muss mindest ein Eintrag ausgewählt sein.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"Es muss mindestens ein Thema ausgewählt sein.",CLIPBOARD_IS_EMPTY:"Es gibt nichts zu kopieren. Die Zwischenablage ist leer.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"Das zentrale Thema kann nicht gelöscht werden.",RELATIONSHIP_COULD_NOT_BE_CREATED:"Die Beziehung konnte nicht angelegt werden. Es muss erst ein Vater-Thema ausgewählt werden, um die Beziehung herzustellen.",SELECTION_COPIED_TO_CLIPBOARD:"Themen in der Zwischenablage",WRITE_YOUR_TEXT_HERE:"Schreiben Sie ihre Notiz hier ...",REMOVE:"Entfernen",ACCEPT:"Akzeptieren",CANCEL:"Abbrechen",LINK:"Verbindung",OPEN_LINK:"Öffne URL",DUMMY:""};mindplot.Messages.BUNDLES.fr={ZOOM_IN:"Agrandir affichage",ZOOM_OUT:"Réduire affichage",TOPIC_SHAPE:"Forme du noeud",TOPIC_ADD:"Ajouter un noeud",TOPIC_DELETE:"Supprimer le noeud",TOPIC_ICON:"Ajouter une icône",TOPIC_LINK:"Ajouter un lien",TOPIC_RELATIONSHIP:"Relation du noeud",TOPIC_COLOR:"Couleur du noeud",TOPIC_BORDER_COLOR:"Couleur de bordure du noeud",TOPIC_NOTE:"Ajouter une note",FONT_FAMILY:"Type de police",FONT_SIZE:"Taille de police",FONT_BOLD:"Caractères gras",FONT_ITALIC:"Caractères italiques",UNDO:"Annuler",REDO:"Refaire",INSERT:"Insérer",SAVE:"Enregistrer",NOTE:"Note",ADD_TOPIC:"Ajouter un noeud",LOADING:"Chargement ...",EXPORT:"Exporter",PRINT:"Imprimer",PUBLISH:"Publier",COLLABORATE:"Partager",HISTORY:"Historique",DISCARD_CHANGES:"Annuler les changements",FONT_COLOR:"Couleur de police",SAVING:"Enregistrement ...",SAVE_COMPLETE:"Enregistrement terminé",ZOOM_IN_ERROR:"Zoom trop grand.",ZOOM_ERROR:"Impossible de zoomer plus.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"Impossible de créer un noeud. Un seul noeud doit être sélectionné.",ONE_TOPIC_MUST_BE_SELECTED:"Impossible de créer un noeud. Un noeud parent doit être sélectionné au préalable.",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Un noeud enfant ne peut pas être réduit. Un noeud doit être sélectionné.",SAVE_COULD_NOT_BE_COMPLETED:"Enregistrement impossible. Essayer ultérieurement.",UNEXPECTED_ERROR_LOADING:"Nous sommes désolés, une erreur vient de survenir.\nEssayez de recharger l'éditeur. Si le problème persiste, contactez-nous : support@wisemapping.com.",MAIN_TOPIC:"Noeud titre principal",SUB_TOPIC:"Noeud sous-titre",ISOLATED_TOPIC:"Noeud isolé",CENTRAL_TOPIC:"Noeud racine",SHORTCUTS:"Raccourcis clavier",ENTITIES_COULD_NOT_BE_DELETED:"Impossible d'effacer un noeud ou une relation. Au moins un objet de la carte doit être sélectionné.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"Au moins un objet de la carte doit être sélectionné.",CLIPBOARD_IS_EMPTY:"Rien à copier. Presse-papier vide.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"Le noeud racine ne peut pas être effacé.",RELATIONSHIP_COULD_NOT_BE_CREATED:"Impossible de créer relation. Un noeud parent doit être sélectionné au préalable.",SELECTION_COPIED_TO_CLIPBOARD:"Noeuds sélectionnés copiés dans le presse-papiers.",ACCEPT:"Accepter",CANCEL:"Annuler",REMOVE:"Supprimer",WRITE_YOUR_TEXT_HERE:"Écrivez votre texte ici ...",LINK:"Lien",DUMMY:""};mindplot.Messages.BUNDLES.pt_br={ZOOM_IN:"Ampliar",ZOOM_OUT:"Reduzir",TOPIC_SHAPE:"Forma do T\u00f3pico",TOPIC_ADD:"Adicionar T\u00f3pico",TOPIC_DELETE:"Deletar T\u00f3pico",TOPIC_ICON:"Adicionar \u00cdcone",TOPIC_LINK:"Adicionar Link",TOPIC_RELATIONSHIP:"Relacionamento",TOPIC_COLOR:"Cor do T\u00f3pico",TOPIC_BORDER_COLOR:"Cor da Borda do T\u00f3pico",TOPIC_NOTE:"Adicionar Nota",FONT_FAMILY:"Tipo de Fonte",FONT_SIZE:"Tamanho da Fonte",FONT_BOLD:"Fonte Negrito",FONT_ITALIC:"Fonte It\u00e1lico",UNDO:"Desfazer",REDO:"Refazer",INSERT:"Inserir",SAVE:"Salvar",NOTE:"Nota",ADD_TOPIC:"Adicionar T\u00f3pico",LOADING:"Carregando ...",EXPORT:"Exportar",PRINT:"Imprimir",PUBLISH:"Publicar",COLLABORATE:"Colaborar",HISTORY:"Hist\u00f3ria",DISCARD_CHANGES:"Descartar Altera\u00e7\u00f5es",FONT_COLOR:"Cor da Fonte",SAVING:"Salvando ...",SAVE_COMPLETE:"Salvamento Completo",ZOOM_IN_ERROR:"Zoom excessivo.",ZOOM_ERROR:"N\u00e3o \u00e9 poss\u00edvel aplicar mais zoom.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"N\u00e3o foi poss\u00edvel criar t\u00f3pico. Apenas um t\u00f3pico deve ser selecionado.",ONE_TOPIC_MUST_BE_SELECTED:"N\u00e3o foi poss\u00edvel criar t\u00f3pico. Um t\u00f3pico deve ser selecionado.",SAVE_COULD_NOT_BE_COMPLETED:"Salvamento n\u00e3o pode ser completado. Tente novamente mais tarde.",UNEXPECTED_ERROR_LOADING:"Ocorreu um erro inesperado.\nTente recarregar novamente o editor. Se o problema persistir, contacte-nos em support@wisemapping.com.",MAIN_TOPIC:"T\u00f3pico Principal",SUB_TOPIC:"Sub T\u00f3pico",ISOLATED_TOPIC:"T\u00f3pico Isolado",CENTRAL_TOPIC:"T\u00f3pico Central",SHORTCUTS:"Atalho",ENTITIES_COULD_NOT_BE_DELETED:"O tópico ou a relação não pode ser apagado. Seleccionar pelo menos um.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"Pelo menos um tópico deve ser selecionado",CLIPBOARD_IS_EMPTY:"Nada para copiar. Clipboard está vazio.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"O tópico central não pode ser apagado.",RELATIONSHIP_COULD_NOT_BE_CREATED:"A relação não pode ser criada. Uma relação pai deve ser selecionada primeiro.",SELECTION_COPIED_TO_CLIPBOARD:"Tópicos copiados ao clipboard.",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Tópicos filhos não podem ser colapsados. Só um tópico deve ser selecionado.",DUMMY:""};mindplot.Messages.BUNDLES.zh_cn={ZOOM_IN:"放大",ZOOM_OUT:"缩小",TOPIC_SHAPE:"节点外形",TOPIC_ADD:"添加节点",TOPIC_DELETE:"删除节点",TOPIC_ICON:"加入图标",TOPIC_LINK:"添加链接",TOPIC_RELATIONSHIP:"关系",TOPIC_COLOR:"节点颜色",TOPIC_BORDER_COLOR:"边框颜色",TOPIC_NOTE:"添加注释",FONT_FAMILY:"字体",FONT_SIZE:"文字大小",FONT_BOLD:"粗体",FONT_ITALIC:"斜体",UNDO:"撤销",REDO:"重做",INSERT:"插入",SAVE:"保存",NOTE:"注释",ADD_TOPIC:"添加节点",LOADING:"载入中……",EXPORT:"导出",PRINT:"打印",PUBLISH:"公开",COLLABORATE:"共享",HISTORY:"历史",DISCARD_CHANGES:"清除改变",FONT_COLOR:"文本颜色",SAVING:"保存中……",SAVE_COMPLETE:"完成保存",ZOOM_IN_ERROR:"缩放过多。",ZOOM_ERROR:"不能再缩放。",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"不能创建节点。仅能选择一个节点。",ONE_TOPIC_MUST_BE_SELECTED:"不能创建节点。必须选择一个节点。",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"子节点不能折叠。必须选择一个节点。",SAVE_COULD_NOT_BE_COMPLETED:"保存未完成。稍后再试。",UNEXPECTED_ERROR_LOADING:"抱歉，突遭错误，我们无法处理你的请求。\n尝试重新装载编辑器。如果问题依然存在请联系support@wisemapping.com。",MAIN_TOPIC:"主节点",SUB_TOPIC:"子节点",ISOLATED_TOPIC:"独立节点",CENTRAL_TOPIC:"中心节点",SHORTCUTS:"快捷键",ENTITIES_COULD_NOT_BE_DELETED:"不能删除节点或者关系。至少应选择一个对象。",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"至少应选择一个节点。",CLIPBOARD_IS_EMPTY:"无法拷贝。 粘贴板是空的。",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"不能删除根节点。",RELATIONSHIP_COULD_NOT_BE_CREATED:"不能创建关系。 应先选择创建关系的一对上级节点。",SELECTION_COPIED_TO_CLIPBOARD:"节点已拷贝到粘贴板。",DUMMY:""};mindplot.Messages.BUNDLES.zh_tw={ZOOM_IN:"放大",ZOOM_OUT:"縮小",TOPIC_SHAPE:"節點外形",TOPIC_ADD:"添加節點",TOPIC_DELETE:"刪除節點",TOPIC_ICON:"加入圖示",TOPIC_LINK:"添加鏈接",TOPIC_RELATIONSHIP:"關係",TOPIC_COLOR:"節點顏色",TOPIC_BORDER_COLOR:"邊框顏色",TOPIC_NOTE:"添加注釋",FONT_FAMILY:"字體",FONT_SIZE:"文字大小",FONT_BOLD:"粗體",FONT_ITALIC:"斜體",UNDO:"撤銷",REDO:"重做",INSERT:"插入",SAVE:"保存",NOTE:"注釋",ADD_TOPIC:"添加節點",LOADING:"載入中……",EXPORT:"導出",PRINT:"列印",PUBLISH:"公開",COLLABORATE:"共用",HISTORY:"歷史",DISCARD_CHANGES:"清除改變",FONT_COLOR:"文本顏色",SAVING:"保存中……",SAVE_COMPLETE:"完成保存",ZOOM_IN_ERROR:"縮放過多。",ZOOM_ERROR:"不能再縮放。",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"不能創建節點。僅能選擇一個節點。",ONE_TOPIC_MUST_BE_SELECTED:"不能創建節點。必須選擇一個節點。",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"子節點不能折疊。必須選擇一個節點。",SAVE_COULD_NOT_BE_COMPLETED:"保存未完成。稍後再試。",UNEXPECTED_ERROR_LOADING:"抱歉，突遭錯誤，我們無法處理你的請求。\n嘗試重新裝載編輯器。如果問題依然存在請聯繫support@wisemapping.com。",MAIN_TOPIC:"主節點",SUB_TOPIC:"子節點",ISOLATED_TOPIC:"獨立節點",CENTRAL_TOPIC:"中心節點",SHORTCUTS:"快捷鍵",ENTITIES_COULD_NOT_BE_DELETED:"不能刪除節點或者關係。至少應選擇一個對象。",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"至少應選擇一個節點。",CLIPBOARD_IS_EMPTY:"無法拷貝。 粘貼板是空的。",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"不能刪除根節點。",RELATIONSHIP_COULD_NOT_BE_CREATED:"不能創建關係。 應先選擇創建關係的一對上級節點。",SELECTION_COPIED_TO_CLIPBOARD:"節點已拷貝到粘貼板。",DUMMY:""};mindplot.Messages.BUNDLES.ca={DISCARD_CHANGES:"Descartar els canvis",SAVE:"Desar",INSERT:"Inserir",ZOOM_IN:"Apropar",ZOOM_OUT:"Allunyar",TOPIC_BORDER_COLOR:"Color del bord",TOPIC_SHAPE:"Forma del Tòpic",TOPIC_ADD:"Afegir Tòpic",TOPIC_DELETE:"Esborrar Tòpic",TOPIC_ICON:"Afegir Icona",TOPIC_LINK:"Afegir Enllaç",TOPIC_NOTE:"Afegir Nota",TOPIC_COLOR:"Color del Tòpic",TOPIC_RELATIONSHIP:"Relació",FONT_FAMILY:"Tipus de font",FONT_SIZE:"Mida del text",FONT_BOLD:"Negreta",FONT_ITALIC:"Itàlica",FONT_COLOR:"Color del Text",UNDO:"Refer",NOTE:"Nota",LOADING:"Carregant ...",PRINT:"Imprimir",PUBLISH:"Publicar",REDO:"Desfer",ADD_TOPIC:"Afegir Tòpic",COLLABORATE:"Compartir",EXPORT:"Exportar",HISTORY:"Història",SAVE_COMPLETE:"Desat completat",SAVING:"Gravant ...",ONE_TOPIC_MUST_BE_SELECTED:"No ha estat possible crear un nou tòpic. Com a mínim ha de seleccionar un tòpic.",ONLY_ONE_TOPIC_MUST_BE_SELECTED:"No ha estar possible crear un nou tòpic. Només un tòpic ha d'estar seleccionat.",SAVE_COULD_NOT_BE_COMPLETED:"No s'ha pogut desar. Provi més tard.",UNEXPECTED_ERROR_LOADING:"Ho sentim, un error ha esdevingut inesperadament. Provi recarregant l'editor, si el problema continua contacti a support@wisemapping.com.",ZOOM_ERROR:"No es pot fer més zoom.",ZOOM_IN_ERROR:"El zoom és massa creixent.",MAIN_TOPIC:"Tòpic principal",SUB_TOPIC:"Tòpic secundari",ISOLATED_TOPIC:"Tòpic aïllat",CENTRAL_TOPIC:"Tòpic central",ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE:"Els tòpics fills no es poden col·lapsar. Només un tòpic ha d'estar seleccionat.",SHORTCUTS:"Accessos directes",ENTITIES_COULD_NOT_BE_DELETED:"El tòpic o la relució no poden ser esborrats. Com a mínim ha de seleccionar un.",AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED:"Com a mínim ha de seleccionar un tòpic.",CLIPBOARD_IS_EMPTY:"Res a copiar.",CENTRAL_TOPIC_CAN_NOT_BE_DELETED:"El tòpic central no pot esborrar-se.",RELATIONSHIP_COULD_NOT_BE_CREATED:"La relució no s'ha pout drear. Primer has de seleccionar una relució pare.",SELECTION_COPIED_TO_CLIPBOARD:"Tòpics copiats",WRITE_YOUR_TEXT_HERE:"Escriu aquí la teva nota ...",REMOVE:"Esborrar",ACCEPT:"Acceptar",CANCEL:"Cancel·lar",LINK:"Enllaç",OPEN_LINK:"Obrir Enllaç",SESSION_EXPIRED:"La seva sessió ha finalitzat. Si us plau, torni a connectar-se.",DUMMY:""};try{$(document).trigger("loadcomplete","mind")
}catch(e){console.error(e.stack)
};