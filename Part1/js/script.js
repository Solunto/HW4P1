/*
//	Intro. to GUI 1 HW4
//	Date: 8/7/2021
//	By: Ari Primak
//	This assignment involved converting HW3 to use JQuery in part 1, and adding functionality with JQuery (sliders and tabs)
//  in part 2.
*/
var tableHTML;

$().ready(function() {
    $('#theForm').validate({
        rules: {
            minX: {
                required: true,
                notEq: "#maxX",
                intOnly: true,
                number: true,
                min: -50,
                max: 50,

            },
            
            minY: {
                required: true,
                notEq: "#maxY",
                intOnly: true,
                number: true,
                min: -50,
                max: 50
            },
        
            maxX: {
                required: true,
                notEq: "#minX",
                intOnly: true,
                number: true,
                min: -50,
                max: 50
            },
        
            maxY: {
                required: true,
                notEq: "#minY",
                intOnly: true,
                number: true,
                min: -50,
                max: 50
            }
        },

        messages: {
            minX: {
                required: "This field is required"
                //intOnly's default message is fine (specified below)
                //same wrt notEq
                //min and max's defaults are also fine
            },

            minY: {
                required: "This field is required"
            },

            maxX: {
                required: "This field is required"
            },

            maxY: {
                required: "This field is required"
            }
        },

        validClass: "pass",

        errorClass: "invalid",

        errorPlacement: function(error, element) {
            error.appendTo(element.closest(".fielddiv"));
        },

        submitHandler: function(form) {
            //We already know the data is valid, so we don't need to check            
            //There's some wacky nonsense going on with the > operator if I don't cast them with Number(). It's not okay.
            if (Number($('#minX').val()) > Number($('#maxX').val())) {
                temp = $('#maxX').val();
                $('#maxX').val($('#minX').val());
                $('#minX').val(temp);
            }
    
            if (Number($('#minY').val()) > Number($('#maxY').val())) {
                temp = $('#maxY').val();
                $('#maxY').val($('#minY').val());
                $('#minY').val(temp);
            }
            generateTable($('#minX').val(), $('#maxX').val(), $('#minY').val(), $('#maxY').val());
        }
    });
    
    //Accepts only integers; there are 2 forms valid expressions can take: a "-" followed by [1-9] followed by 
    //zero or more instances of [0-9] OR one or more instances of [0-9]. Regex is fun! Well... sometimes.
    //-0 is not an integer!
    //The form +xxx seems to work too, and I'm not sure why. This is still wrong in the case of +0, but I find it less
    //offensive, so I'll let it lie. Also, I can't explain why it's allowed. That's another reason to ignore it.
    jQuery.validator.addMethod("intOnly", function(value, element) {
        return this.optional(element) || /^((-[1-9][0-9]*)|[0-9]*)$/.test(String(value));
    }, 'Only integers are considered valid input (-0 is neither an integer nor a number)');

    //I couldn't quite get it to work so I went on google, and found people wrote almost the exact same code... I swear this is original!
    //My issue was that I was attempting to reference the value of the argument ID with "xxx.valueAsNumber" when I needed to call .val()
    //instead. Oops.
    jQuery.validator.addMethod("notEq", function(value, element, eqID) {
        return this.optional(element) || value != $(eqID).val();
    }, 'Min and Max of an axis cannot be the same');

})

function generateTable(leftX, rightX, topY, botY) {
    //The amount of columns is equal to the difference between min and max X plus 1 for the left-side header
    var tbWidth = rightX - leftX + 1;
    //Same reasoning for rows, except that the top row (header) doesn't need to be counted for this var.
    var tbHeight = botY - topY;

    const widthArray = [];
    const heightArray = [];
    //The strange condition for the for loop is to enable the use of "i" for both array index
    //purposes and as input for each such index
    for (var i = 0; i <= rightX - leftX; i++)
        widthArray[i] = i + Number(leftX);

    for (var i = 0; i <= botY - topY; i++)
        heightArray[i] = i + Number(topY);

    //Open the table, along with it's first (header) row and its first (blank) entry
    tableHTML = "<table><tr id=\"headerRow\"><th id=\"blank\"></th>";
    //Populate the first row's entries with the correct values
    for (var i = 0; i < widthArray.length; i++)
        tableHTML += "<th>" + widthArray[i] + "</th>";
    //Close the first row
    tableHTML += "</tr>";

    //Next, for each row (an amount of rows equal to the length of heightArray) open it and , 
    //populate the leftmost column (the left header)
    for (var i = 0; i < heightArray.length; i++) {
        tableHTML += "<tr><th class=\"headerColumn\">" + heightArray[i] + "</th>";
        //Then, populate the rest of the row with the product of the left and top headers
        for (var k = 0; k < widthArray.length; k++)
            tableHTML += "<th>" + (heightArray[i] * widthArray[k]) + "</th>";
        //Close the row and loop
        tableHTML += "</tr>";
    }
    //Close the table
    tableHTML += "</table>";
    //Overwrite the innerHTML of the #table div (by default it is empty) with the new table
    $("#table").html(tableHTML);
}



/**************************************************    HW3 Code    *******************************************************/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function getNums() {
//     //First, assume there are no errors in the input values, and set the css for that case
//     //I had an issue where I couldn't figure out what values would turn the borders of each
//     //field back to the default look. I eventually googled it, and found out the answer was
//     //"no values at all"... TMYK.
//     minXField.style.border = "";
//     maxXField.style.border = "";
//     minYField.style.border = "";
//     maxYField.style.border = "";
//     document.getElementById("error").innerHTML = "";
//     //If you mess up the input without leaving it blank (ie. by putting in a +/- beyond the first character),
//     //then it will still report as blank (valueMissing will == true). This is because when a type:number field
//     //receives what it thinks is non-numeric input, it throws it out and reports as having no input. I thought
//     //about changing the error message to account for this, and I would if this were a program I expected people
//     //to actually use, but I thought commenting on it here would be sufficient and it saves me the effort on
//     //styling a longer line of text. 
//     if (minXField.validity.valueMissing) {
//         document.getElementById("error").innerHTML = "Error: the horizontal-axis minimum value field must not be left blank"
//         minXField.style.border = "2px solid red";
//         return;
//     }
//     minXVal = minXField.valueAsNumber;
//     if (maxXField.validity.valueMissing) {
//         document.getElementById("error").innerHTML = "Error: the horizontal-axis maximum value field must not be left blank"
//         maxXField.style.border = "2px solid red";
//         return;
//     }
//     maxXVal = maxXField.valueAsNumber;
//     if (minYField.validity.valueMissing) {
//         document.getElementById("error").innerHTML = "Error: the vertical-axis minimum value field must not be left blank"
//         minYField.style.border = "2px solid red";
//         return;
//     }
//     minYVal = minYField.valueAsNumber;
//     if (maxYField.validity.valueMissing) {
//         document.getElementById("error").innerHTML = "Error: the vertical-axis maximum value field must not be left blank"
//         maxYField.style.border = "2px solid red";
//         return;
//     }
//     maxYVal = maxYField.valueAsNumber;

//     //Swaps the min and max values for an axes if they need to be swapped to be coherent
//     if (minXVal > maxXVal)
//     {
//         temp = maxXVal;
//         maxXVal = minXVal;
//         minXVal = temp;
//         //Updating the input fields to be accurate to the new values
//         minXField.valueAsNumber = minXVal;
//         maxXField.valueAsNumber = maxXVal;
//     }

//     if (minYVal > maxYVal)
//     {
//         temp = maxYVal;
//         maxYVal = minYVal;
//         minYVal = temp;

//         minYField.valueAsNumber = minYVal;
//         maxYField.valueAsNumber = maxYVal;
//     }
//     //Bounds checking
//     if (minXVal < -50) {
//         document.getElementById("error").innerHTML = "Error: the horizontal-axis minimum value must not be lower than -50"
//         minXField.style.border = "2px solid red";
//         return;
//     } else if (maxXVal > 50) {
//         document.getElementById("error").innerHTML = "Error: the horizontal-axis maximum value must not be higher than 50"
//         maxXField.style.border = "2px solid red";
//         return;
//     } else if (minYVal < -50) {
//         document.getElementById("error").innerHTML = "Error: the vertical-axis minimum value must not be lower than -50"
//         minYField.style.border = "2px solid red";
//         return;
//     } else if (maxYVal > 50) {
//         document.getElementById("error").innerHTML = "Error: the vertical-axis maximum value must not be higher than 50"
//         maxYField.style.border = "2px solid red";
//         return;
//     } 
//     generateTable(minXVal, maxXVal, minYVal, maxYVal);
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                



