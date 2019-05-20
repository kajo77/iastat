
//every number represents a different dice side, which number releated to the hashes below
//var seiten = new Hash({black:[1,1,2,2,3,4],white:[1,2,3,4,4,5],red:[1,2,2,3,4,4],green:[1,2,3,4,5,6],yellow:[1,2,3,4,5,6],blue:[1,2,3,4,5,6]});


var schaden=new Hash({red:[1,2,2,2,3,3],blue:[0,1,2,1,2,1],green:[0,1,2,1,2,2],yellow:[0,1,2,1,0,1],black:[0,0,0,0,0,0],white:[0,0,0,0,0,0]});
var blitze=new Hash({red:[1,0,0,1,0,0],blue:[1,1,0,1,0,0],green:[1,1,0,1,0,0],yellow:[1,2,0,1,1,0],black:[0,0,0,0,0,0],white:[0,0,0,0,0,0]});
var reichweite=new Hash({red:[0,0,0,0,0,0],blue:[2,2,3,3,4,5],green:[1,1,1,2,2,3],yellow:[0,0,1,1,2,2],black:[0,0,0,0,0,0],white:[0,0,0,0,0,0]});
var counterschaden=new Hash({red:[0,0,0,0,0,0],blue:[0,0,0,0,0,0],green:[0,0,0,0,0,0],yellow:[0,0,0,0,0,0],black:[1,1,2,2,3,0],white:[0,1,0,1,1,0]});
var counterblitz=new Hash({red:[0,0,0,0,0,0],blue:[0,0,0,0,0,0],green:[0,0,0,0,0,0],yellow:[0,0,0,0,0,0],black:[0,0,0,0,0,1],white:[0,0,1,1,1,0]});
var block=new Hash({red:[0,0,0,0,0,0],blue:[0,0,0,0,0,0],green:[0,0,0,0,0,0],yellow:[0,0,0,0,0,0],black:[0,0,0,0,0,0],white:[0,0,0,0,0,1]});

var extraFieldsCnt = 0;

//called when the DOM is ready
function init() {
	$('.dice').each(function(index,obj) {
		//add the increment function to each dice image		
		$(this).attr('onClick', 'increment(this);');		
	});	
	$('#config').show(300);
	$('#stat').hide(300);
	//$('#extraStats').hide();
	
}

function resetDice() {
	extraFieldsCnt = 0;
	$('#extraStats').hide();
	$('#extraStats').empty();
	
	$('#config').show(300);
	$('#stat').hide(300);
	$('.dice').each(function(index,obj) {
		var curId = obj.id;
		var counter = '#'+curId.substring(0, curId.length - 1);
		//console.log(counter);		
		$(counter).val(0);
	});	
	
	
}

function toggleConf() {
	$('#config').toggle(300);	
}

function increment(obj) {	
	var curId = obj.id;
	var counter = '#'+curId.substring(0, curId.length - 1);
	//console.log(counter);	
    $(counter).val( function(i, oldval) {
        return ++oldval;
    });
}

function addFields() {	
	if ($('#extraStats').css('display') == 'none' ) {		
		$('#extraStats').show();
	}
	extraFieldsCnt += 1;
	
	//get the template for the content
	var content = $('#extraStatTemplate').html();		
	//replace the content XXX placholder with the current counter
	content = content.replace(/XXX/gi,extraFieldsCnt);
	
	//add the fields to ui
	$('#extraStats').append(content);		
}

function calcStat() {
	//toggle config
	$('#config').hide(300);
	$('#stat').show(300);
	
	//clear the old statistic
	$("#stat ul").remove();
	$("#stat").append('<ul id="statlist"></ul>');
	
	//calculate the statistic and write them to the DIV tag
	//calculate the maximum reach for the dice
	var maxreach = 0;
	//console.log('0reach: '+ maxreach);	
	$('.inputfield_dice').each( function(i, obj) {
		var objval = $('#'+obj.id).val();		
		console.log(obj.id);			
		if (objval>0) {
			for (i = 0; i < objval; i++) {
				maxreach += getMaxReach(obj.id);
				//console.log('1reach: '+ maxreach);	
			}
		}		
	});
	maxreach += parseInt($('#rw').val(),10);
	
	//add the list entries to the list
	//console.log('Maximum reach: '+ maxreach);	
	for (i = 0; i <= maxreach; i++) {
		//calculate statistic for each reach	
		//TODO: do the statistic calculation here
		$('#statlist').append('<li>'+i+'<ul><li>Schaden:</li><li>Blitz:</li></ul></li>');
	}
	
}

function getMaxReach(objid) {
	var result = Math.max.apply(Math,reichweite.getItem(objid));
	console.log(objid + '=' + result);
	return parseInt(result,10);
}

//small Hash implementation
function Hash(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}
     
