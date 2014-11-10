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
