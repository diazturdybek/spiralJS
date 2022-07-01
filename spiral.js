/*!
 * Spiral JS
 * Copyright 2022 Diaz Turdybek ( https://github.com/diazturdybek )
 * Licensed under MIT
*/


const SpiralJS = (function() {


    class Spiral {


        constructor(targetID, config) {
            this._canvas = document.getElementById(targetID);
            this._context = this._canvas.getContext('2d');

            Object.assign(this, {
                padding: 120,
                
                distance: {
                    initial: 6,
                    current: null,
                    pitch: 0,
                },

                angle: {
                    initial: 0,
                    current: null,
                    pitch: 0.05,
                },

                radius: {
                    initial: 0,
                    final: null,
                    current: null,
                },

                line: {
                    width: 2,
                    cap: 'butt',
                    join: 'round',
                    dash: [],
                    dashOffset: 0,
                },

                brush: {
                    fillType: 'fill',
                    fillArguments: null,
                    color: '#ffffff',
                },

                background: {
                    fillType: 'fill',
                    fillArguments: null,
                    color: '#000000',
                },

                rotate: {
                    current: 0,
                    pitch: 0.075,
                },

                pulsing: {
                    growPitch: 2.5,
                    shrinkPitch: 2.5,
                    radius: 0.2,
                    status: true,
                    currentAction: 'shrink',
                },

                position: 'center',

            }, config);
            this.renderRequestID = null;
            this.toggleRender();
        }


        renderHandler() {
            if(this._canvas.width !== this._canvas.parentElement.clientWidth ||
                this._canvas.height !== this._canvas.parentElement.clientHeight) {
                this.resizeHandler();
            }

            this._context.fillStyle = this.background.style;
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

            this.distance.current = this.distance.initial;
            this.radius.current = this.radius.initial;
            this.angle.current = this.angle.initial;

            if(this.rotate.current === 360) {
                this.rotate.current = 0;
            } else {
                this.rotate.current += this.rotate.pitch;
            }

            if(this.pulsing.status) {
                if(this.radius.final >= this.radius.initialFinal) {
                    this.pulsing.currentAction = 'shrink';
                } else if (this.radius.final <= this.radius.initialFinal * this.pulsing.radius) {
                    this.pulsing.currentAction = 'grow';
                }

                if(this.pulsing.currentAction === 'shrink') {
                    this.radius.final -= this.pulsing.shrinkPitch;
                } else {
                    this.radius.final += this.pulsing.growPitch;
                }
            }

            this._context.save();
            this._context.strokeStyle = this.brush.style;
            this._context.setLineDash(this.line.dash);
            this._context.lineDashOffset = this.line.dashOffset;
            this._context.lineWidth = this.line.width;
            this._context.lineJoin = this.line.join;
            this._context.lineCap = this.line.cap;
            this._context.beginPath();

            while(this.radius.current <= this.radius.final) {
                this.distance.current += this.distance.pitch;
                this.angle.current += this.angle.pitch;

                this.radius.current = this.radius.initial +
                    (this.distance.current * this.angle.current);
                let coordX = this.spiralCenterX +
                    (this.radius.current * Math.cos(this.angle.current - this.rotate.current));
                let coordY = this.spiralCenterY +
                    (this.radius.current * Math.sin(this.angle.current - this.rotate.current));

                this._context.lineTo(coordX, coordY);
            }

            this._context.stroke();
            this._context.restore();

            this.renderRequestID = window.requestAnimationFrame(this.renderHandler.bind(this));
        }



        resizeHandler() {
            this._canvas.width = this._canvas.parentElement.clientWidth;
            this._canvas.height = this._canvas.parentElement.clientHeight;
            this.centerY = this._canvas.height / 2;
            this.centerX = this._canvas.width / 2;
            
            if(this._canvas.width >= this._canvas.height) {
                this.radius.final = this.centerY - this.padding;
            } else {
                this.radius.final = this.centerX - this.padding;
            }

            if(this.position === 'center') {
                this.spiralCenterX = this.centerX;
                this.spiralCenterY = this.centerY;
            } else {
                this.spiralCenterX = this._canvas.width * this.position[0];
                this.spiralCenterY = this._canvas.height * this.position[1];
            }

            this.radius.initialFinal = this.radius.final;
            this.updateStyle('brush');
            this.updateStyle('background');
        }


        toggleRender(status = true) {
            if(status === true && this.renderRequestID === null) {
                this.renderHandler();
            } else if(status === false && this.renderRequestID !== null) {
                window.cancelAnimationFrame(this.renderRequestID);
                this.renderRequestID = null;               
            }
        }


        updateStyle(styleName, styleConfig = {}) {
            Object.assign(this[styleName], styleConfig);

            switch(this[styleName].fillType) {
                case 'fill':
                    this[styleName].style = this[styleName].color;
                    break;
                case 'radialGradient':
                    this[styleName].style = this.createRadialGradient(this[styleName]);
                    break;
                case 'linearGradient':
                    this[styleName].style = this.createLinearGradient(this[styleName]);
                    break;
            }
        }



        createRadialGradient(styleConfig) {
            let style = this._context.createRadialGradient(
                this.centerX + styleConfig.fillArguments[0],
                this.centerY + styleConfig.fillArguments[1],
                styleConfig.fillArguments[2],
                this.centerX + styleConfig.fillArguments[3],
                this.centerY + styleConfig.fillArguments[4],
                this.radius.initialFinal + styleConfig.fillArguments[5]
            );
            Spiral.createColorStop(style, styleConfig.color);
            return style;
        }


        createLinearGradient(styleConfig) {
            let style = this._context.createLinearGradient(
                styleConfig.fillArguments[0],
                styleConfig.fillArguments[1],
                this._canvas.width - styleConfig.fillArguments[2],
                this._canvas.height - styleConfig.fillArguments[3]
            );
            Spiral.createColorStop(style, styleConfig.color);
            return style;
        }


        static createColorStop(style, colorList) {
            for(let i = 0; i < colorList.length; i++) {
                style.addColorStop(
                    colorList[i][0],
                    colorList[i][1]
                );
            }
        }


    }




    function init(targetID, config = {}) {
        let spiral = new Spiral(targetID, config);
        return spiral;
    }


    return {
        init: init
    }


})();