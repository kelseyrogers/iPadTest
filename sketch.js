var particleSystem = [];
var attractors = [];
var table;
var aggregated = {};
var connections = [];
var uniqueInvestors = [];
var companyToDisplay = null;
var backDisplay = false;
var mouseClicked_ = false;

function preload() {
    table = loadTable("data/investments.csv", "csv", "header");
    categoryTable = loadTable("data/companies_categories.csv", "csv", "header");
}

function setup() {

    var canvas = createCanvas(windowWidth, windowHeight);
    background(80);
    frameRate(30);

    colorMode(HSB, 360, 100, 100, 100);

    var at = new Attractor(createVector(width / 2, height / 2), 1);
    attractors.push(at);

    print(table.getRowCount() + "total rows in table");


    var aggregatedInvestors = {};
    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var iname = table.getString(r, "investor_name");
        invested = parseInt(invested);
        if (!isNaN(invested)) {
            if (aggregated.hasOwnProperty(cname)) {
                aggregated[cname] = aggregated[cname] + invested;
            } else {
                aggregated[cname] = invested;
            }
            
            if (aggregatedInvestors.hasOwnProperty(iname)){
                aggregatedInvestors[iname]+=invested;
                
            }else{
                aggregatedInvestors[iname] = invested;
            }
           
        }
        //aggregatedInvestors[iname] = "anything";
        

    }
    
    

    var aAggregated = [];
    Object.keys(aggregated).forEach(function (name_) {
        var company = {};
        company.name = name_;
        company.sum = aggregated[name_]
        aAggregated.push(company);
    });


    var aAggregatedInvestors = [];
    Object.keys(aggregatedInvestors).forEach(function (name_) {

        var investor = new Investor(name_, aggregatedInvestors[name_]);
       
        aAggregatedInvestors.push(investor);
    });
    
    console.log(aAggregatedInvestors);



    aAggregated = aAggregated.sort(function (companyA, companyB) {
        return companyB.sum - companyA.sum;
    });

    aAggregated = aAggregated.slice(0, 200);

    var aCategories = [];

    for (var r = 0; r < categoryTable.getRowCount(); r++) {
        var cname = categoryTable.getString(r, "name");
        var category_ = categoryTable.getString(r, "category_code");
        //look into aCategories see if it already has a "category_code"
        var foundRow = aCategories.find(function (row) {
            return row.category == category_;
        });
        if (foundRow) {
            foundRow.count++;
        } else {
            var row = {};
            row.category = category_;
            row.count = 1;
            aCategories.push(row);
        }
    }


    aCategories.sort(
        function (categoryA, categoryB) {
            return categoryB.count - categoryA.count;
        });


    //print(aCategories);

    //we are creating 100 particles for the first 100 top companies (aAggregated provides the top companies)
    for (var i = 0; i < 175; i++) {
        //get the category code
        var company_name = aAggregated[i].name;
        var company_sum = aAggregated[i].sum;
        var row = categoryTable.findRow(company_name, "name");

        var category = row.getString("category_code");
        var p = new Particle(company_name, company_sum, category);
        particleSystem.push(p);
    }

    for (var r = 0; r < table.getRowCount(); r++) {
        var compname = table.getString(r, "company_name");
        var iname = table.getString(r, "investor_name");
        var invested = table.getString(r, "amount_usd");

        var foundCompany = aAggregated.find(function (element, index, array) {
            if (element.name == compname) return true;
            else return false;
        });


        var foundInvestor = false;
        if (foundCompany) {
            foundInvestor = aAggregatedInvestors.find(function (element, index, array) {
                if (element.name == iname) return true;
                else return false;
            });
        }

        if (foundCompany && foundInvestor) {
            var connection = {};
            connection.company = foundCompany;
            connection.investor = foundInvestor;
            connection.amount = invested;
            connections.push(connection);

        }
    }

    connections.forEach(function (connection) {
        var found = uniqueInvestors.find(function (uniqueInvestor) {
            return uniqueInvestor == connection.investor;
        });

        if (!found) uniqueInvestors.push(connection.investor);
    });

    for (var i = 0; i < uniqueInvestors.length; i++) {
        angle = i * 360 / uniqueInvestors.length;
        uniqueInvestors[i].x = width / 2;
        uniqueInvestors[i].y = height / 2;
    
    /*300 * Math.sin(angle) +*/
        
    }

}

function draw() {

    background(80);

    if (backDisplay == false) {
        for (var i = 0; i < uniqueInvestors.length - 1; i++) {
            noStroke();
            fill(0, 100, 100, 100);
            
            
            //ellipse(Investors[i].x, uniqueInvestors[i].y, sqrt(connection[i].amount / 4000), sqrt(connection[i].amount / 4000));
            
            //sqrt(aAggregatedInvestors[i].amount / 4000)
        }
    noStroke();
    fill(0);
    textAlign(LEFT);
    textSize(24);
    text("The Top 200", width / 50, 40);
    textSize(14)
    fill(0);
    text("Companies with Largest Investments in 2013", width / 50, 60)
    textSize(10);
    fill(255);
    text("BY KELSEY ROGERS", width / 50, 75);
    textSize(9);
    fill(136, 65, 54, 100);
    text("Northeastern University 2016", width / 50, 88);
        
        
    }

    /*for (var i=0; i<connections.length; i++){
        particleSystem.find(function(element, index, array){
            if(element.name == )
        });
    }*/
    if (backDisplay == true) {
        noStroke();
        fill(200);
        rect(width / 25 - 30, height / 1.05 - 15, 60, 30, 10);
        fill(50);
        textAlign(CENTER);
        textSize(14);
        text("BACK", width / 25, height / 1.05 + 6);

        if (mouseClicked_) {
            investorsToDisplay = [];

            for (var i = 0; i < connections.length; i++) {
                if (connections[i].company.name == companyToDisplay.name) {
                    investorObject = connections[i].investor;
                    var investorInList = investorsToDisplay.find(function (iv) {
                        return investorObject == iv;

                    });

                    if (!investorInList) {
                        investorsToDisplay.push(connections[i].investor);
                    }
                }
                
            }

            //make function that makes the investors evenly spaced
            for (var i = 0; i < investorsToDisplay.length; i++) {
                var inv = investorsToDisplay[i];
                angle = i * TWO_PI / investorsToDisplay.length;
                var x = 250 * cos(angle) + width / 2;
                var y = 250 * sin(angle) + height / 2;

                var newPos = createVector(x, y);
                inv.trigger(newPos);
                inv.x = companyToDisplay.pos.x;
                inv.y = companyToDisplay.pos.y;

            }

            mouseClicked_ = false;

        }

        investorsToDisplay.forEach(function (investor) {
            investor.update();
            investor.draw(companyToDisplay);
        });

    }

    if (companyToDisplay != null) {
        companyToDisplay.draw();
        companyToDisplay.update();

        /*for(var i=0; i<connections.length; i++){
            if (connections[i].company.name == companyToDisplay.name){
                break;
            }
        }*/


    } else {

        //pairwise comparisons
        for (var STEPS = 0; STEPS < 4; STEPS++) {
            for (var i = 0; i < particleSystem.length - 1; i++) {
                for (var j = i + 1; j < particleSystem.length; j++) {
                    var pa = particleSystem[i];
                    var pb = particleSystem[j];
                    var ab = p5.Vector.sub(pb.pos, pa.pos);
                    var distSq = ab.magSq();
                    if (distSq <= sq(pa.radius + pb.radius)) {
                        var dist = sqrt(distSq);
                        var overlap = (pa.radius + pb.radius) - dist;
                        ab.div(dist);
                        ab.mult(overlap * 0.5);
                        pb.pos.add(ab);
                        ab.mult(-1);
                        pa.pos.add(ab);
                        pa.vel.mult(0.97);
                        pb.vel.mult(.97);
                    }
                }
            }
        }

        particleSystem.forEach(function (p) {
            p.draw();
            p.update();
        });


        attractors.forEach(function (at) {

            at.draw();

        });

    }

}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}

var Investor = function (name, amount) {
    this.x = 0;
    this.y = 0;
    this.name = name;
    this.amount = amount;
    this.newPos = createVector(0, 0);
    var arrived = true;

    this.draw = function (companyToDisplay) {
        stroke(360, 0, 100, 10);
        strokeWeight(2);
        line(this.x, this.y, companyToDisplay.pos.x, companyToDisplay.pos.y);

        noStroke();
        fill(136, 45, 78, 100);
        ellipse(this.x, this.y, sqrt(this.amount)/1000, sqrt(this.amount)/1000);
        //sqrt(connections[i].amount)/1000

        textFont("Avenir");
        noStroke();
        fill(255);
        textAlign(LEFT);
        textSize(10);
        
        push();
        var a = atan2(this.y - height / 2, this.x - width / 2);
        //start by coloring the text that is in a certain range of a
        
        
        translate(this.x, this.y);
        rotate(a);
        if((a > HALF_PI + 0.8 && a < PI+0.8 )|| (a < -HALF_PI -0.8 && a > -PI -0.8)){
            rotate(PI);
            textAlign(RIGHT);
        }
            
        
        text(this.name, 0,0);
        pop();
        
        var newRadius = 1.7;
        var newx = this.x + (companyToDisplay.pos.x - this.x)/newRadius;
        var newy = this.y + (companyToDisplay.pos.y - this.y)/newRadius;
        
        textAlign(CENTER);
        textSize(7);
        fill(150);
        push();
        var a = atan2(newy - height / 2, newx - width / 2);
        translate(newx, newy);
        rotate(a);
        if((a > HALF_PI && a < PI )|| (a < -HALF_PI && a > -PI)){
            rotate(PI);
        }
        text("$" + nfc(this.amount, 0), 0,0);
        pop();

    }

    this.trigger = function (newPos) {
        this.newPos = newPos;
        arrived = false;

    }

    this.update = function () {
        if (!arrived) {
            var vel = createVector(this.newPos.x - this.x, this.newPos.y - this.y);
            if (vel.mag() < 20) {
                arrived = true;
            }
            vel.normalize();
            vel.mult(20);
            this.x = this.x + vel.x;
            this.y = this.y + vel.y;
        }
    }
}


var homeDisplay = function(){
    
    
}

var Particle = function (name, sum, category) {

    this.category = category;
    this.name = name;
    this.sum = sum;

    switch (this.category) {
    case "web":
        this.color = {
            h: 237
            , s: 50
            , b: 78
        };
        break;
    case "software":
        this.color = {
            h: 216
            , s: 79
            , b: 82
        };
        break;
    case "biotech":
        this.color = {
            h: 195
            , s: 74
            , b: 73
        };
        break;
    case "mobile":
        this.color = {
            h: 174
            , s: 79
            , b: 82
        };
        break;
    case "enterprise":
        this.color = {
            h: 240
            , s: 43
            , b: 73
        };
        break;
    case "ecommerce":
        this.color = {
            h: 285
            , s: 75
            , b: 78
        };
        break;
    case "games_video":
        this.color = {
            h: 263
            , s: 76
            , b: 82
        };
        break;
    case "advertising":
        this.color = {
            h: 242
            , s: 71
            , b: 73
        };
        break;
    case "cleantech":
        this.color = {
            h: 221
            , s: 76
            , b: 82
        };
        break;
    case "social":
        this.color = {
            h: 200
            , s: 76
            , b: 78
        };
        break;
    case "medical":
        this.color = {
            h: 292
            , s: 43
            , b: 78
        };
        break;
    default:
        this.color = {
            h: 182
            , s: 35
            , b: 82
        };
    }

    this.radius = sqrt(sum) / 3000;
    var initialRadius = this.radius;

    this.psize = sqrt(sum) / 1000;

    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));

    this.pos.div(this.radius);
    this.pos.mult(3000);
    var isMouseOver = false;

    this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);

    var acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    var maximumRadius = 70;


    this.update = function () {

        checkMouse(this);

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.pos);
            var distanceSq = att.magSq();
            if (distanceSq > 1) {
                att.normalize();
                att.div(10);
                att.mult(1 * A.getStrength());
                acc.add(att);
            }
        }, this);

        this.vel.add(acc);
        this.pos.add(this.vel);
        acc.mult(0);

        if (backDisplay) {
            this.vel.mult(.97);
            companyToDisplay.radius = 70;
            noStroke();
            textAlign(LEFT);
            textSize(24);
            text("Investors For: " + companyToDisplay.name, width / 50, 40);
            textSize(14)
            fill(0);
            text("Company Type: " + companyToDisplay.category, width/50, 60)
            textSize(10);
            fill(255);
            text("Number of Investor Companies: " + investorsToDisplay.length, width/50, 75);
            textSize(9);
            fill(136, 65, 54, 100);
            text("Total Investment Amount: $"+nfc(this.sum, 0), width/50, 88);
            
        }
    }


    this.getPos = function () {
        return pos.copy();
    }

    this.draw = function () {



        noStroke();
        if (isMouseOver) {
            fill(this.color.h, this.color.s + 40, this.color.b, 100);
        } else {
            fill(this.color.h, this.color.s, this.color.b, 100);
        }

        ellipse(this.pos.x
            , this.pos.y
            , this.radius * 2 - 4
            , this.radius * 2 - 4);
        if (this.radius == maximumRadius) {
            textFont("Avenir");
            fill(0);
            textAlign(CENTER);
            textSize(16);
            text(this.name, this.pos.x, this.pos.y - 5);
            textSize(10);
            text("Total Investments (USD):", this.pos.x, this.pos.y + 9);
            text("$" + nfc(this.sum, 0), this.pos.x, this.pos.y + 20);
            //text("Category:" + this.category, this.pos.x, this.pos.y + 25);
        }

    }



    this.getSize = function () {
        return psize;
    }

    function checkMouse(instance) {
        var mousePos = createVector(mouseX, mouseY);
        if (mousePos.dist(instance.pos) <= instance.radius) {
            incRadius(instance);
            isMouseOver = true;
        } else {
            decRadius(instance);
            isMouseOver = false;
        }
    }

    function incRadius(instance) {
        instance.radius += 4;
        if (instance.radius > maximumRadius) {
            instance.radius = maximumRadius;
        }
    }

    function decRadius(instance) {
        instance.radius -= 4;
        if (instance.radius < initialRadius) {
            instance.radius = initialRadius;
        }
    }



}

var Attractor = function (pos, s) {
    var pos = pos.copy();
    var strength = s;
    this.draw = function () {
        noStroke();
        fill(100, 100, 100, 100);
        //ellipse(pos.x, pos.y, strength, strength);
    }

    this.getStrength = function () {
        return strength;
    }
    this.getPos = function () {
        return pos.copy();
    }

}

function mouseClicked() {

    if (backDisplay == false) {
        for (var i = 0; i < particleSystem.length; i++) {
            var particle = particleSystem[i];
            var pointVec = createVector(mouseX, mouseY);
            var particleVec = particle.pos.copy();
            var vecPtoPoint = particleVec.sub(pointVec);

            if (vecPtoPoint.magSq() < sq(particle.radius)) {
                companyToDisplay = particle;
                mouseClicked_ = true;
                break;
            }
        }

        investorsToDisplay = [];
        backDisplay = true;
    }

    if (backDisplay == true && mouseX > width / 25 - 30 && mouseX < width / 25 + 30 && mouseY > height / 1.05 - 15 && mouseY < height / 1.05 + 15) {

        companyToDisplay = null;
        backDisplay = false;

    }


}