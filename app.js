const convertButton1 = document.querySelector('[convert-1]')
const convertButton2 = document.querySelector('[convert-2]')
const downloadBtn = document.querySelector('[downloadBtn]')
const downloadBtn2 = document.querySelector('[downloadBtn2]')
convertButton1.onclick = ()    => { decimalToBCD(); }
convertButton2.onclick = ()    => { bcdToDECIMALConversion(); } //listener for convert button
downloadBtn.onclick = () => { download_file(bcdResult); } //listener for download button
downloadBtn2.onclick = () => { download_file2(decResult); } //listener for download button

//declare global variable bcdResult to store it in result.txt after donwloadbutton is clicked
let bcdResult = "";
let decResult = "";

// this function is called when the convertButton1 is clicked and it converts the decimal number to BCD
function decimalToBCD() {
    const x = document.getElementById("dec").value;

    // unsigned
    if(x[0] != "+" && x[0] != "-"){
        let unpacked = dec_to_unpacked(x);
        let packed = dec_to_packed(x);
        let dpacked = dec_to_densely(x, packed);
        
        var spaced_unpacked = unpacked.split('').map((c, i) => (i % 4 === 0 && i !== 0) ? " " + c : c).join('');
        var spaced_packed = packed.split('').map((c, i) => (i % 4 === 0 && i !== 0) ? " " + c : c).join('');
        var spaced_densely = dpacked.split('').map((c, i) => (i % 10 === 0 && i !== 0) ? " " + c : c).join('');

        document.getElementById("output1").innerHTML = 
        " Unpacked BCD: " + spaced_unpacked + "<br>" 
        + "Packed BCD: " + spaced_packed + "<br>"
        + " Densely-packed BCD: " + spaced_densely + "<br>" ;

        bcdResult = "Unpacked BCD:" + spaced_unpacked + "\n" + "Packed BCD:" + spaced_packed + "\n" + "Densely-packed BCD:" + spaced_densely + "\n";
        //download_file(bcdResult);
        //return spaced_densely + " " + spaced_packed + " " + spaced_unpacked;
    }
    //signed
    else{
        let packed = "";

        for (let i = 1; i < x.length; i++) {
            const digit = parseInt(x[i]);
            for (let j = 0; j < 4; j++) {
                const bitValue = (digit >> (3 - j)) & 1;
                packed += bitValue.toString();
            }
        }

        let spaced_packed = packed.split('').map((c, i) => (i % 4 === 0 && i !== 0) ? " " + c : c).join('');

        if(x[0] == "+"){
            spaced_packed = spaced_packed.concat(" 1100");
        }
        else{
            spaced_packed = spaced_packed.concat(" 1101");
        }
        bcdResult = "BCD result for Packed BCD[Signed]:" + spaced_packed + "\n";
        // download_file(bcdResult);
        document.getElementById("output1").innerHTML = 
        "Packed BCD [Signed]: " + spaced_packed + "<br>"
        // spaced_packed;
    }
}

function dec_to_unpacked(x){
    let unpacked = "";

    for (let i = 0; i < x.length; i++) {
        const digit = parseInt(x[i]);
        for (let j = 0; j < 8; j++) {
            const bitValue = (digit >> (7 - j)) & 1;
            unpacked += bitValue.toString();
            if(j%4 == 0 && j!= 0)
                unpacked.concat(unpacked, " ");
        }
    }
    
    return unpacked;
}

function dec_to_packed(x){
    let packed = "";

    for (let i = 0; i < x.length; i++) {
        const digit = parseInt(x[i]);

        for (let j = 0; j < 4; j++) {
            const bitValue = (digit >> (3 - j)) & 1;
            packed += bitValue.toString();
        }
    }

    return packed;
}

function dec_to_densely(x, packed){
    const holder = packed.split("");
    let densely_packed = new Array(10);
    let merge = new Array(10000);


    if (x.length % 3 != 0) {
        if (x.length % 3 == 1){
            for (let i = 0; i < 8; i++){
                holder.unshift(0);
            }
        }

        else {
            for (let i = 0; i < 4; i++){
                holder.unshift(0);
            }
        }
    }

    while (holder.length > 0) {
        densely_packed[5] = holder[7];
        densely_packed[9] = holder[11];
    
        //000
        if (holder[0] == '0' && holder[4] == '0' && holder[8] == '0') {
            for (let i = 0; i < 3; i++){
                densely_packed[i] = holder[i + 1];
            }
    
            for (let i = 3; i < 5; i++){
                densely_packed[i] = holder[i + 2];
            }
    
            densely_packed[6] = '0';
    
            for (let i = 7; i < 10; i++){
                densely_packed[i] = holder[i + 2];
            }
        }
    
        //001
        else if (holder[0] == '0' && holder[4] == '0' && holder[8] == '1') {
            for (let i = 0; i < 3; i++){
                densely_packed[i] = holder[i + 1];
            }
    
            for (let i = 3; i < 5; i++){
                densely_packed[i] = holder[i + 2];
            }
    
            densely_packed[6] = '1';
            densely_packed[7] = '0';
            densely_packed[8] = '0';
        }
    
        //010
        else if (holder[0] == '0' && holder[4] == '1' && holder[8] == '0') {
            for (let i = 0; i < 3; i++){
                densely_packed[i] = holder[i + 1];
            }
            densely_packed[3] = holder[9];
            densely_packed[4] = holder[10];
            densely_packed[6] = '1';
            densely_packed[7] = '0';
            densely_packed[8] = '1';
        }
    
        //011
        else if (holder[0] == '0' && holder[4] == '1' && holder[8] == '1') {
            for (let i = 0; i < 3; i++){
                densely_packed[i] = holder[i + 1];
            }
            densely_packed[3] = '1';
            densely_packed[4] = '0';
            densely_packed[6] = '1';
            densely_packed[7] = '1';
            densely_packed[8] = '1';
        }
    
        //100
        else if (holder[0] == '1' && holder[4] == '0' && holder[8] == '0') {
            densely_packed[0] = holder[9];
            densely_packed[1] = holder[10];
            densely_packed[2] = holder[3];
            densely_packed[3] = holder[5];
            densely_packed[4] = holder[6];
            densely_packed[6] = '1';
            densely_packed[7] = '1';
            densely_packed[8] = '0';
        }
    
        //101
        else if (holder[0] == '1' && holder[4] == '0' && holder[8] == '1') {
            densely_packed[0] = holder[5];
            densely_packed[1] = holder[6];
            densely_packed[2] = holder[3];
            densely_packed[3] = '0';
            densely_packed[4] = '1';
            densely_packed[6] = '1';
            densely_packed[7] = '1';
            densely_packed[8] = '1';
        }
    
        //110
        else if (holder[0] == '1' && holder[4] == '1' && holder[8] == '0') {
            densely_packed[0] = holder[9];
            densely_packed[1] = holder[10];
            densely_packed[2] = holder[3];
            densely_packed[3] = '0';
            densely_packed[4] = '0';
            densely_packed[6] = '1';
            densely_packed[7] = '1';
            densely_packed[8] = '1';
        }
        
        //111
        else if (holder[0] == '1' && holder[4] == '1' && holder[8] == '1') {
            densely_packed[0] = '0';
            densely_packed[1] = '0';
            densely_packed[2] = holder[3];
            densely_packed[3] = '1';
            densely_packed[4] = '1';
            densely_packed[6] = '1';
            densely_packed[7] = '1';
            densely_packed[8] = '1';
        }

        merge = merge.concat(densely_packed);
    
        for (let i = 0; i < 12; i++){
            holder.shift()
        }

    }

    let dpacked = merge.join("");
    return dpacked;
}


/* this function converts the densely packed binary to decimal */
function bcdToDECIMALConversion() {
    let dpacked = document.getElementById("dpacked").value;
    let holder = dpacked.replace(/\s+/g, '').split("");
    let packed_holder= new Array(10);

    let decimal_equiv = "";

    if (holder.length % 10 != 0) {
        document.getElementById("output2").innerHTML = "Input length must be a multiple of 10."
    }

    else {
        let times = holder.length / 10;
        for(let i = 0; i < times; i++){
            let num = 10 * i;

            let p = holder[0+num];
            let q = holder[1+num];
            let r = holder[2+num];
            let s = holder[3+num];
            let t = holder[4+num];
            let u = holder[5+num];
            let v = holder[6+num];
            let w = holder[7+num];
            let x = holder[8+num];
            let y = holder[9+num];
        
            //1
            if (v == '0') {
                packed_holder[0] = '0';
                packed_holder[1] = p;
                packed_holder[2] = q;
                packed_holder[3] = r;
                packed_holder[4] = '0';
                packed_holder[5] = s;
                packed_holder[6] = t;
                packed_holder[7] = u;
                packed_holder[8] = '0';
                packed_holder[9] = w;
                packed_holder[10] = x;
                packed_holder[11] = y;
            }
        
            //2
            else if (v == '1' && w == '0' && x == '0') {
                packed_holder[0] = '0';
                packed_holder[1] = p;
                packed_holder[2] = q;
                packed_holder[3] = r;
                packed_holder[4] = '0';
                packed_holder[5] = s;
                packed_holder[6] = t;
                packed_holder[7] = u;
                packed_holder[8] = '1';
                packed_holder[9] = '0';
                packed_holder[10] = '0';
                packed_holder[11] = y;
            }
        
            //3
            else if (v == '1' && w == '0' && x == '1') {
                packed_holder[0] = '0';
                packed_holder[1] = p;
                packed_holder[2] = q;
                packed_holder[3] = r;
                packed_holder[4] = '1';
                packed_holder[5] = '0';
                packed_holder[6] = '0';
                packed_holder[7] = u;
                packed_holder[8] = '0';
                packed_holder[9] = s;
                packed_holder[10] = t;
                packed_holder[11] = y;
            }
        
            //4
            else if (v == '1' && w == '1' && x == '0') {
                packed_holder[0] = '1';
                packed_holder[1] = '0';
                packed_holder[2] = '0';
                packed_holder[3] = r;
                packed_holder[4] = '0';
                packed_holder[5] = s;
                packed_holder[6] = t;
                packed_holder[7] = u;
                packed_holder[8] = '0';
                packed_holder[9] = p;
                packed_holder[10] = q;
                packed_holder[11] = y;
            }
        
            //5
            else if (v == '1' && w == '1' && x == '1' && s == '0' && t == '0') {
                packed_holder[0] = '1';
                packed_holder[1] = '0';
                packed_holder[2] = '0';
                packed_holder[3] = r;
                packed_holder[4] = '1';
                packed_holder[5] = '0'
                packed_holder[6] = '0'
                packed_holder[7] = u;
                packed_holder[8] = '0';
                packed_holder[9] = p;
                packed_holder[10] = q;
                packed_holder[11] = y;
            }
        
            //6
            else if (v == '1' && w == '1' && x == '1' && s == '0' && t == '1') {
                packed_holder[0] = '1';
                packed_holder[1] = '0';
                packed_holder[2] = '0';
                packed_holder[3] = r;
                packed_holder[4] = '0';
                packed_holder[5] = p;
                packed_holder[6] = q;
                packed_holder[7] = u;
                packed_holder[8] = '1';
                packed_holder[9] = '0';
                packed_holder[10] = '0';
                packed_holder[11] = y;
            }
        
            //7
            else if (v == '1' && w == '1' && x == '1' && s == '1' && t == '0') {
                packed_holder[0] = '0';
                packed_holder[1] = p;
                packed_holder[2] = q;
                packed_holder[3] = r;
                packed_holder[4] = '1';
                packed_holder[5] = '0'
                packed_holder[6] = '0'
                packed_holder[7] = u;
                packed_holder[8] = '1';
                packed_holder[9] = '0';
                packed_holder[10] = '0';
                packed_holder[11] = y;
            }
        
        
            //8
            else if (v == '1' && w == '1' && x == '1' && s == '1' && t == '1') {
                packed_holder[0] = '1';
                packed_holder[1] = '0'
                packed_holder[2] = '0';
                packed_holder[3] = r;
                packed_holder[4] = '1';
                packed_holder[5] = '0'
                packed_holder[6] = '0'
                packed_holder[7] = u;
                packed_holder[8] = '1';
                packed_holder[9] = '0';
                packed_holder[10] = '0';
                packed_holder[11] = y;
            }

            packed_string = packed_holder.join('');
            dec = parseInt(packed_to_dec(packed_string));
            decimal_equiv = decimal_equiv.concat(dec);
        }
        
        document.getElementById("output2").innerHTML = "Decimal: " + decimal_equiv + "<br>"
    }

    // Download result
    decResult = "Densely Packed to Decimal:" +  decimal_equiv;  
}

function packed_to_dec(packed_string){
    let x = "";

    for (let i = 0; i < packed_string.length; i += 4) {
        const bits = packed_string.substr(i, 4);
        const digit = parseInt(bits, 2);
        x += digit.toString();
    }

    return x;
}


/*function to download the results from result.txt, this function gets called after conversion of either*/
function download_file(bcdResult) {
    //store result to result.txt
    const filename = "decimal-to-bcd.txt";
    //create a temporary file in memory
    const element = document.createElement("a");
    //write the result stored in bcdResult.txt to element
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(bcdResult));
    element.setAttribute("download", filename);
  
    element.style.display = "none";
    document.body.appendChild(element);
  
    element.click();
  
    document.b
  } 

  function download_file2(decResult) {
    //store result to result.txt
    const filename = "denselypacked-to-decimal.txt";
    //create a temporary file in memory
    const element = document.createElement("a");
    //write the result stored in bcdResult.txt to element
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(decResult));
    element.setAttribute("download", filename);
  
    element.style.display = "none";
    document.body.appendChild(element);
  
    element.click();
  
    document.b
  } 




