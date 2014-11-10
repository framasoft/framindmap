var core={};$defined=function(obj){return(obj!=undefined)
};
$assert=function(assert,message){if(!$defined(assert)||!assert){logStackTrace();
console.log(message);
throw new Error(message)
}};
Math.sign=function(value){return(value>=0)?1:-1
};
function logStackTrace(exception){if(!$defined(exception)){try{throw Error("Unexpected Exception")
}catch(e){exception=e
}}var result="";
if(exception.stack){result=exception.stack
}else{if(window.opera&&exception.message){result=exception.message
}else{result=exception.sourceURL+": "+exception.line+"\n\n";
var currentFunction=arguments.callee.caller;
while(currentFunction){var fn=currentFunction.toString();
result=result+"\n"+fn;
currentFunction=currentFunction.caller
}}}window.errorStack=result;
return result
}if(!window.console){console={log:function(e){}}
};core.Utils={};
core.Utils.innerXML=function(node){if($defined(node.innerXML)){return node.innerXML
}else{if($defined(node.xml)){return node.xml
}else{if($defined(XMLSerializer)){return(new XMLSerializer()).serializeToString(node)
}}}};
core.Utils.createDocument=function(){var doc=null;
if($defined(window.ActiveXObject)){var progIDs=["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0"];
for(var i=0;
i<progIDs.length;
i++){try{doc=new ActiveXObject(progIDs[i]);
break
}catch(ex){}}}else{if(window.document.implementation&&window.document.implementation.createDocument){doc=window.document.implementation.createDocument("","",null)
}}$assert(doc,"Parser could not be instantiated");
return doc
};/*
 ---

 name: Overlay

 authors:
 - David Walsh (http://davidwalsh.name)

 license:
 - MIT-style license

 requires: [Core/Class, Core/Element.Style, Core/Element.Event, Core/Element.Dimensions, Core/Fx.Tween]

 provides:
 - Overlay
 ...
 */

var Overlay = new Class({

    Implements: [Options, Events],

    options: {
        id: 'overlay',
        color: '#000000',
        duration: 500,
        opacity: 0.8,
        zIndex: 5000/*,
         onClick: $empty,
         onClose: $empty,
         onHide: $empty,
         onOpen: $empty,
         onShow: $empty
         */
    },

    initialize: function(container, options) {
        this.setOptions(options);
        this.container = document.id(container);

        this.bound = {
            'window': {
                resize: this.resize.bind(this),
                scroll: this.scroll.bind(this)
            },
            overlayClick: this.overlayClick.bind(this),
            tweenStart: this.tweenStart.bind(this),
            tweenComplete: this.tweenComplete.bind(this)
        };

        this.build().attach();
    },

    build: function() {
        this.overlay = new Element('div', {
            id: this.options.id,
            opacity: 0,
            styles: {
                position: (Browser.ie6) ? 'absolute' : 'fixed',
                background: this.options.color,
                left: 0,
                top: 0,
                'z-index': this.options.zIndex
            }
        }).inject(this.container);

        this.tween = new Fx.Tween(this.overlay, {
            duration: this.options.duration,
            link: 'cancel',
            property: 'opacity'
        });
        return this;
    }.protect(),

    attach: function() {
        window.addEvents(this.bound.window);
        this.overlay.addEvent('click', this.bound.overlayClick);
        this.tween.addEvents({
            onStart: this.bound.tweenStart,
            onComplete: this.bound.tweenComplete
        });
        return this;
    },

    detach: function() {
        var args = Array.prototype.slice.call(arguments);
        args.each(function(item) {
            if (item == 'window') window.removeEvents(this.bound.window);
            if (item == 'overlay') this.overlay.removeEvent('click', this.bound.overlayClick);
        }, this);
        return this;
    },

    overlayClick: function() {
        this.fireEvent('click');
        return this;
    },

    tweenStart: function() {
        this.overlay.setStyles({
            width: '100%',
            height: this.container.getScrollSize().y
        });
        return this;
    },

    tweenComplete: function() {
        this.fireEvent(this.overlay.get('opacity') == this.options.opacity ? 'show' : 'hide');
        return this;
    },

    open: function() {
        this.fireEvent('open');
        this.overlay.setStyle('display', 'block');
        this.tween.start(this.options.opacity);
        return this;
    },

    close: function() {
        this.fireEvent('close');
        this.overlay.setStyle('display', 'none');
        this.tween.start(0);
        return this;
    },

    destroy: function(){
        this.close();
        this.overlay.dispose();
    },

    resize: function() {
        this.fireEvent('resize');
        this.overlay.setStyle('height', this.container.getScrollSize().y);
        return this;
    },

    scroll: function() {
        this.fireEvent('scroll');
        if (Browser.ie6) this.overlay.setStyle('left', window.getScroll().x);
        return this;
    }

});
/*
---
name: MooDialog
description: The base class of MooDialog
authors: Arian Stolwijk
license:  MIT-style license
requires: [Core/Class, Core/Element, Core/Element.Styles, Core/Element.Event]
provides: [MooDialog, Element.MooDialog]
...
*/


var MooDialog = new Class({

	Implements: [Options, Events],

	options: {
		'class': 'MooDialog',
		title: null,
		scroll: true, // IE
		forceScroll: false,
		useEscKey: true,
		destroyOnHide: true,
		autoOpen: true,
		closeButton: true,
		onInitialize: function(){
			this.wrapper.setStyle('display', 'none');
		},
		onBeforeOpen: function(){
			this.wrapper.setStyle('display', 'block');
			this.fireEvent('show');
		},
		onBeforeClose: function(){
			this.wrapper.setStyle('display', 'none');
			this.fireEvent('hide');
		}
	},

	initialize: function(options){
		this.setOptions(options);
		this.options.inject = this.options.inject || document.body;
		options = this.options;

		var wrapper = this.wrapper = new Element('div.' + options['class'].replace(' ', '.')).inject(options.inject);

		if (options.title){
			this.title = new Element('div.title').set('text', options.title).inject(wrapper);
//			this.title.addClass('MooDialogTitle');
		}

		if (options.closeButton){
			this.closeButton = new Element('a.close', {
				events: {click: this.close.bind(this)}
			}).inject(wrapper);
		}
        this.content = new Element('div.content').inject(wrapper);


		/*<ie6>*/// IE 6 scroll
		if ((options.scroll && Browser.ie6) || options.forceScroll){
			wrapper.setStyle('position', 'absolute');
			var position = wrapper.getPosition(options.inject);
			window.addEvent('scroll', function(){
				var scroll = document.getScroll();
				wrapper.setPosition({
					x: position.x + scroll.x,
					y: position.y + scroll.y
				});
			});
		}
		/*</ie6>*/

		if (options.useEscKey){
			// Add event for the esc key
			document.addEvent('keydown', function(e){
				if (e.key == 'esc') this.close();
			}.bind(this));
		}

		this.addEvent('hide', function(){
			if (options.destroyOnHide)
                this.destroy();
		}.bind(this));

		this.fireEvent('initialize', wrapper);
	},

	setContent: function(){
		var content = Array.from(arguments);
		if (content.length == 1) content = content[0];

		this.content.empty();

		var type = typeOf(content);
		if (['string', 'number'].contains(type)) this.content.set('text', content);
		else this.content.adopt(content);

		return this;
	},

	open: function(){
		this.fireEvent('beforeOpen', this.wrapper).fireEvent('open');
		this.opened = true;
		return this;
	},

	close: function(){
		this.fireEvent('beforeClose', this.wrapper).fireEvent('close');
		this.opened = false;
		return this;
	},

	destroy: function(){
		this.wrapper.destroy();
	},

	toElement: function(){
		return this.wrapper;
	}

});


Element.implement({

	MooDialog: function(options){
		this.store('MooDialog',
			new MooDialog(options).setContent(this).open()
		);
		return this;
	}

});
/*
 ---
 name: MooDialog.Request
 description: Loads Data into a Dialog with Request
 authors: Arian Stolwijk
 license:  MIT-style license
 requires: [MooDialog, Core/Request.HTML]
 provides: MooDialog.Request
 ...
 */

MooDialog.Request = new Class({

    Extends: MooDialog,

    initialize: function(url, requestOptions, options) {
        this.parent(options);
        this.requestOptions = requestOptions || {};
        this.requestOptions.update = this.content;
        this.requestOptions.evalScripts = true;
        this.requestOptions.noCache = true;

        this.requestOptions.onFailure = function(xhr) {
            // Intercept form requests ...
            console.log("Failure:");
            console.log(xhr);
        }.bind(this);

        this.requestOptions.onSuccess = function() {
            // Intercept form requests ...
            var forms = this.content.getElements('form');
            forms.forEach(function(form) {
                form.addEvent('submit', function(event) {
                    // Intercept form ...
                    this.requestOptions.url = form.action;
                    this.requestOptions.method = form.method ? form.method : 'post';
                    var request = new Request.HTML(this.requestOptions);
                    request.post(form);
                    event.stopPropagation();
                    return false;
                }.bind(this))
            }.bind(this));
        }.bind(this);

        this.addEvent('open', function() {
            this.requestOptions.url = url;
            this.requestOptions.method = 'get';
            var request = new Request.HTML(this.requestOptions);
            request.send();

            MooDialog.Request.active = this;
        }.bind(this));

        this.addEvent('close', function() {
            MooDialog.Request.active = null;
        }.bind(this));

        if (this.options.autoOpen) this.open();
    },

    setRequestOptions: function(options) {
        this.requestOptions = Object.merge(this.requestOptions, options);
        return this;
    }

});
/*
---
name: MooDialog.Fx
description: Overwrite the default events so the Dialogs are using Fx on open and close
authors: Arian Stolwijk
license: MIT-style license
requires: [Cores/Fx.Tween, Overlay]
provides: MooDialog.Fx
...
*/


MooDialog.implement('options', {

	duration: 400,
	closeOnOverlayClick: true,

	onInitialize: function(wrapper){
		this.fx = new Fx.Tween(wrapper, {
			property: 'opacity',
			duration: this.options.duration
		}).set(0);
	},

	onBeforeOpen: function(wrapper){
        this.overlay = new Overlay(this.options.inject, {
            duration: this.options.duration
        });
        if (this.options.closeOnOverlayClick)
            this.overlay.addEvent('click', this.close.bind(this));
		this.overlay.open();
		this.fx.start(1).chain(function(){
			this.fireEvent('show');
		}.bind(this));
	},

	onBeforeClose: function(wrapper){
		this.overlay.destroy();
		this.fx.start(0).chain(function(){
			this.fireEvent('hide');
		}.bind(this));
	}

});
