        var copiedObject;
        var copiedObjects = new Array();
        var canvasScale = 1;
        var SCALE_FACTOR = 1.2;
        var src = window.location.href.replace('index.html','');
        var canvas = new fabric.Canvas('canvas', {
            backgroundColor : 'white',
            strokeWidth: 5,
            stroke: 'red',
            fill: 'red', 
            isDrawingMode: false
        });

        //adding circle to canvas
        var onSolidCircle = function () {
            canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 250, left: 250 }));
        }
        //adding triangle to canvas
        var onSolidTriangle = function(){
       canvas.add(new fabric.Triangle({ width:60, height: 70, fill: 'blue', left: 50, top: 50 }));
		}
        //adding line to canvas
        var onSolidLine = function(){
        canvas.add(new fabric.Line([50, 100, 150, 100], {
        left: 120,
        top: 80,
        strokeWidth: 5,
        stroke: 'red',
        fill: 'red'
        }));
		}
        //adding rectangle to canvas
        var onSolidRect = function () {
            var rect = new fabric.Rect({
                top: 150,
                left: 150,
                width: 60,
                height: 70,
                fill: '',
                selection: false,
                fill: '#f55'
            });
            canvas.add(rect);
        }
        //adding text box to canvas
        function Addtext() { 
        var text = new fabric.IText('Tap and Type Text', {
            left: 100,
            top: 100,
            fontFamily: 'arial',
            fill: '#333',
	        fontSize: 50
        });
        canvas.add(text).setActiveObject(text);
        canvas.renderAll();
        }
        
        //starting free drawing
        var onStartDrawing = function () {
         canvas.isDrawingMode= true;
         canvas.freeDrawingBrush.color = 'red';
         canvas.freeDrawingBrush.width = 10;
         canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
         canvas.renderAll();
        }
        //stopping free drawing
        var onStopDrawing = function () {

            canvas.isDrawingMode = false;
        }
        //adding image file to canvas
        document.getElementById('file').addEventListener("change", function (e) {
         var file = e.target.files[0];
         var reader = new FileReader();
         reader.onload = function (f) {
         var data = f.target.result;                    
         fabric.Image.fromURL(data, function (img) {
         var oImg = img.set({left: 100, top: 100, angle:0, }).scale(0.2);
         canvas.add(oImg).renderAll();
         var a = canvas.setActiveObject(oImg);
         var dataURL = canvas.toDataURL({format: 'png', quality: 3.0});
         });
         };
         reader.readAsDataURL(file);
        });
        //zoom function starts
        var onZoomIn = function () {
            // TODO limit the max canvas zoom in

            canvasScale = canvasScale * SCALE_FACTOR;

            canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
            canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);

            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;

                var tempScaleX = scaleX * SCALE_FACTOR;
                var tempScaleY = scaleY * SCALE_FACTOR;
                var tempLeft = left * SCALE_FACTOR;
                var tempTop = top * SCALE_FACTOR;

                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();
            }

            canvas.renderAll();
        }

        var onZoomOut = function () {
            canvasScale = canvasScale / SCALE_FACTOR;

            canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
            canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;

                var tempScaleX = scaleX * (1 / SCALE_FACTOR);
                var tempScaleY = scaleY * (1 / SCALE_FACTOR);
                var tempLeft = left * (1 / SCALE_FACTOR);
                var tempTop = top * (1 / SCALE_FACTOR);

                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();
            }

            canvas.renderAll();
        }

        var onResetZoom = function () {

            canvas.setHeight(canvas.getHeight() * (1 / canvasScale));
            canvas.setWidth(canvas.getWidth() * (1 / canvasScale));

            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;

                var tempScaleX = scaleX * (1 / canvasScale);
                var tempScaleY = scaleY * (1 / canvasScale);
                var tempLeft = left * (1 / canvasScale);
                var tempTop = top * (1 / canvasScale);

                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();
            }

            canvas.renderAll();

            canvasScale = 1;
        }
        //zoom function ends here
        //downloading canvas in png format
            var button = document.getElementById('btn-download-png');
            button.addEventListener('click', function (e) {
            var dataURL = canvas.toDataURL('image/png', 2.0);
            button.href = dataURL;
            });
        //calling conversion function to be used for pdf
            var button1 = document.getElementById('btn-download-jpg');
            button1.addEventListener('click', function (e) {
            var dataURL1 = canvas.toDataURL('image/jpeg', 1.0);
            button1.href = dataURL1;
            });

            document.getElementById('download').addEventListener("click", function() {
            // only jpeg is supported by jsPDF
                var imgData = canvas.toDataURL("image/jpeg", 1.0);
                var pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 10, 10, 200, 180);
                pdf.save("download.pdf");
            }, false);
        //pdf export code ends here
        //changing background color
            document.getElementById('color').onchange = function() {
            canvas.setBackgroundColor(this.value);
            canvas.renderAll();
            };

            //changing active object color
            document.getElementById('color').onchange = function() {
            canvas.getActiveObject().set("fill", this.value);
            canvas.renderAll();
            }; 

            //font style
            document.getElementById('font-family').onchange = function() {
            canvas.getActiveObject().set("fontFamily", this.value);
            canvas.renderAll();
            }; 
            //text align
            document.getElementById('text-align').onchange = function() {
            canvas.getActiveObject().set("textAlign", this.value);
            canvas.renderAll();
            };
            //font size
            document.getElementById('text-font-size').onchange = function() {
            canvas.getActiveObject().set("fontSize", this.value);
            canvas.renderAll();
            };
            //text stroke color
            document.getElementById('text-stroke-color').onchange = function() {
            canvas.getActiveObject().set("stroke", this.value);
            canvas.renderAll();
            };
            //text stroke width
            document.getElementById('text-stroke-width').onchange = function() {
            canvas.getActiveObject().set("strokeWidth", this.value);
            canvas.renderAll();
            };	
            //bring active object to front
            document.getElementById('tofront').addEventListener("click",enviarFrente);
            function enviarFrente()
            {
            var myObject = canvas.getActiveObject();
            canvas.bringToFront(myObject);
            canvas.discardActiveObject();
            canvas.renderAll(); 
            }
            //send active object to back
            document.getElementById('toback').addEventListener("click",enviarFondo);
            function enviarFondo()
            {
            var myObject1 = canvas.getActiveObject();
            canvas.sendToBack(myObject1);
            canvas.discardActiveObject();
            canvas.renderAll(); 
            }
            //clear canvas
            function clearCanvas() {
            canvas.clear();
            };
            //image opacity
            document.getElementById('image-opacity').onchange = function() {
            canvas.getActiveObject().set("opacity", this.value);
            canvas.renderAll();
            };
            //active object angle
            document.getElementById('angle').onchange = function() {
            canvas.getActiveObject().set('angle', this.value);
            canvas.renderAll();
            };
            //canvas background color
            document.getElementById('canvas-background-color').onchange = function() {
            canvas.set('backgroundColor', this.value);
            canvas.renderAll();
            };
            //deleting active object
            document.getElementById('delete').addEventListener("click", deleteobject);
            function deleteobject() {
            canvas.getActiveObjects().forEach((obj) => {
            canvas.remove(obj)
            });
            canvas.discardActiveObject().renderAll()
            };
            //eraser width, brush width
            document.getElementById('brushwidth').onchange = function() {
            var size = this.value;
            canvas.freeDrawingBrush.width = size;
            canvas.renderAll();
            };
            //brush color
            document.getElementById('brushcolor').onchange = function() {
            var size = this.value;
            canvas.freeDrawingBrush.color = size;
            canvas.renderAll();
            };

           
            // Text formatting actions..bold and italic code
            var bold = document.getElementById('btn-bold');
            var italic = document.getElementById('btn-italic');

            bold.addEventListener('click', function() {
            dtEditText('bold');
            }); 

            italic.addEventListener('click', function() {
            dtEditText('italic');
            }); 

            // Functions
            function dtEditText(action) {
            var a = action;
            var o = canvas.getActiveObject();
            var t;

            // If object selected, what type?
            if (o) {
                t = o.get('type');
            }

            if (o && t === 'i-text') {
            switch(a) {
            case 'bold':				
                var isBold = dtGetStyle(o, 'fontWeight') === 'bold';
                dtSetStyle(o, 'fontWeight', isBold ? '' : 'bold');
            break;

            case 'italic':
                var isItalic = dtGetStyle(o, 'fontStyle') === 'italic';
                dtSetStyle(o, 'fontStyle', isItalic ? '' : 'italic');
            break;

            canvas.renderAll();
        }
        }
        }

        // Get the style
        function dtGetStyle(object, styleName) {
        return object[styleName];
        }

        // Set the style
        function dtSetStyle(object, styleName, value) {
        object.set(styleName, value);
        canvas.renderAll();
        }  
        //bold and italic code ends here

        //background image code starts here
        document.getElementById('file2').addEventListener("change", function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(f) {
        var data = f.target.result;
        fabric.Image.fromURL(data, function(img) {
         // add background image
         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            opacity: 0.1,
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
         });
        });
            };
        reader.readAsDataURL(file);
        });
        //background image code ends here
        //eraser code starts here
            document.getElementById('brush').addEventListener("click",brush);
            function brush()
            {
            const ErasedGroup = fabric.util.createClass(fabric.Group, {
            original: null,
            erasedPath: null,
            initialize: function (original, erasedPath, options, isAlreadyGrouped) {
            this.original = original;
            this.erasedPath = erasedPath;
            this.callSuper('initialize', [this.original, this.erasedPath], options, isAlreadyGrouped);
            },
            _calcBounds: function (onlyWidthHeight) {
            const aX = [],
                    aY = [],
                    props = ['tr', 'br', 'bl', 'tl'],
                    jLen = props.length,
                    ignoreZoom = true;
                let o = this.original;
                o.setCoords(ignoreZoom);
            for (let j = 0; j < jLen; j++) {
                prop = props[j];
                aX.push(o.oCoords[prop].x);
                aY.push(o.oCoords[prop].y);
            }
            this._getBounds(aX, aY, onlyWidthHeight);
            },
        });
        /*
        * Note1: Might not work with versions other than 3.1.0
        * Made it so that the path will be 'merged' with other objects 
        *  into a customized group and has a 'destination-out' composition
        */
        const EraserBrush = fabric.util.createClass(fabric.PencilBrush, {

            /**
            * On mouseup after drawing the path on contextTop canvas
            * we use the points captured to create an new fabric path object
            * and add it to the fabric canvas.
            */
        _finalizeAndAddPath: function () {
        var ctx = this.canvas.contextTop;
        ctx.closePath();
        if (this.decimate) {
                this._points = this.decimatePoints(this._points, this.decimate);
        }
        var pathData = this.convertPointsToSVGPath(this._points).join('');
        if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
        this.canvas.requestRenderAll();
        return;
            }
        // use globalCompositeOperation to 'fake' eraser
        var path = this.createPath(pathData);
        path.globalCompositeOperation = 'destination-out';
        path.selectable = false;
        path.evented = false;
        path.absolutePositioned = true;
         // grab all the objects that intersects with the path
        const objects = this.canvas.getObjects().filter((obj) => {
      // if (obj instanceof fabric.Textbox) return false;
      // if (obj instanceof fabric.IText) return false;
      if (!obj.intersectsWithObject(path)) return false;
      return true;
        });

        if (objects.length > 0) {

      // merge those objects into a group
      const mergedGroup = new fabric.Group(objects);

      // This will perform the actual 'erasing' 
      // NOTE: you can do this for each object, instead of doing it with a merged group
      // however, there will be a visible lag when there's many objects affected by this
      const newPath = new ErasedGroup(mergedGroup, path);

      const left = newPath.left;
      const top = newPath.top;

      // convert it into a dataURL, then back to a fabric image
      const newData = newPath.toDataURL({
        withoutTransform: true
      });
      fabric.Image.fromURL(newData, (fabricImage) => {
        fabricImage.set({
          left: left,
          top: top,
        });

        // remove the old objects then add the new image
        this.canvas.remove(...objects);
        this.canvas.add(fabricImage);
      });
    }

    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.renderAll();
    this._resetShadow();
    },
        });

    // to use it, just set the brush
    const eraserBrush = new EraserBrush(canvas);
    eraserBrush.width = 10;
    eraserBrush.color = "#ffffff";
    canvas.freeDrawingBrush = eraserBrush;
    canvas.isDrawingMode = true;
    }
    //eraser code ends here

            var stoperaser = function () {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.isDrawingMode = false;
            path.absolutePositioned = false;
            withoutTransform: false;
            path.selectable = true;
            path.evented = true;
            ctx.openPath();
        }
        //different brushes
        var circlebrush = function () {
         canvas.isDrawingMode= true;
         canvas.freeDrawingBrush.color = 'red';
         canvas.freeDrawingBrush.width = 10;
         canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
         canvas.renderAll();
        }

        var patternbrush = function () {
         canvas.isDrawingMode= true;
         canvas.freeDrawingBrush.color = 'red';
         canvas.freeDrawingBrush.width = 10;
         canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
         canvas.renderAll();
        }

        var SprayBrush = function () {
         canvas.isDrawingMode= true;
         canvas.freeDrawingBrush.color = 'red';
         canvas.freeDrawingBrush.width = 10;
         canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
         canvas.renderAll();
        }
        //different types of brushed ends here

        //set shadow
        document.getElementById('shadow').onchange = function() {
        canvas.getActiveObject().set("shadow", this.value);
        canvas.renderAll();
        };

        //image stroke color
            document.getElementById('image-stroke-color').onchange = function() {
            canvas.getActiveObject().set("stroke", this.value);
            canvas.renderAll();
            };
        
        //image stroke size1
        document.getElementById('imageborder1').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 1
        });
        canvas.renderAll();
        });

        //image stroke size2
        document.getElementById('imageborder2').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 2
        });
        canvas.renderAll();
        });

        //image stroke size3
        document.getElementById('imageborder3').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 3
        });
        canvas.renderAll();
        });

        //image stroke size4
        document.getElementById('imageborder4').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 4
        });
        canvas.renderAll();
        });

        //image stroke size5
        document.getElementById('imageborder5').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 5
        });
        canvas.renderAll();
        });

        //image stroke size6
        document.getElementById('imageborder6').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 6
        });
        canvas.renderAll();
        });

        //image stroke size7
        document.getElementById('imageborder7').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 7
        });
        canvas.renderAll();
        });

        //image stroke size8
        document.getElementById('imageborder8').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 8
        });
        canvas.renderAll();
        });

        //image stroke size9
        document.getElementById('imageborder9').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 9
        });
        canvas.renderAll();
        });

        //image stroke size10
        document.getElementById('imageborder10').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 10
        });
        canvas.renderAll();
        });

        //image stroke size15
        document.getElementById('imageborder15').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 15
        });
        canvas.renderAll();
        });

        //image stroke size20
        document.getElementById('imageborder20').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeWidth: 20
        });
        canvas.renderAll();
        });

        //border dashed
        document.getElementById('borderswidth').addEventListener('click', function() {
        canvas.getActiveObject().set({stroke: 'red',
        strokeDashArray: [5, 5]
        });
        canvas.renderAll();
        });

















            //custom canvas size
            function customcanvas900x200() {
            canvas.setDimensions({
            width: 900,
            height: 200
            });
            }

            function customcanvas1000x200() {
            canvas.setDimensions({
            width: 1000,
            height: 200
            });
            } 

            function customcanvas1000x300() {
            canvas.setDimensions({
            width: 1000,
            height: 300
            });
            }