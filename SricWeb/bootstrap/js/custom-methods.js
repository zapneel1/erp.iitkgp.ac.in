/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var positionX = "", positionY = "", modal_positionY = "";

//var scroll;
//$(window).scroll(function (event) {
//    scroll = $(document).scrollTop().valueOf();
//    // Do something
//});
$(document).on("mousemove", ".btn", function (e) {

    modal_positionY = $(this).offset().top;
    //alert(inIframe());
    //modal_positionY = $(this).top;
});

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
//    if (window.frameElement) {
//        return true;
//    } else {
//        return false;
//    }
}
/**
 * 
 * @param {type} id
 * @param {type} url
 * @param {type} parameters is key value array
 * @param {type} hasAll
 * @returns {void}
 */
function createSelectPickerAndLoad(target_div, label, id, name, url, parameters, hasAll, action) {
    var layout = '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 form-group"><label for="' + id + '">' + label + '</label><select id="' + id + '" name="' + name + '" class="selectpicker form-control" data-size="5" data-live-search="true" ></select></div>';
    if ($("#" + id).length === 0) {
        $("#" + target_div).append(layout);
        if (action === "LOAD") {
            updateSelectPicker("#" + id, url, parameters, hasAll);
        }

    }
}

function  updateSelectPicker(id, url, parameters, hasAll) {
    //alert(id + url + hasAll);
    $(id).empty();
    $(id).selectpicker('refresh');
    var complete_link = createlink(url, parameters);
    $.ajax({
        url: complete_link,
        type: "POST",
        cache: false,
        dataType: "json",
        beforeSend: function () {
            $("body").append("<div id='overlay' style='position:absolute;top:0;left:0;height:200%;width:100%;z-index:999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='img/busy.gif' alt='Loadingg...' height='150' width='150'/></center></div>");
        },
        success: function (json) {
            $("#overlay").remove();
            //alert(JSON.stringify(json));
            var html_formation = "";
            if (json === null) {
                myalert("SERVER NOT RESPONDING ERROR", "Please Try After Some Time. If The Same Problem Happens Again Then Please Contact To ERP Administrator.");
            } else {
                var column_name = [];
                for (var key in json[0]) {
                    column_name.push(key.toString());
                }

                if (hasAll === "ALL") {
                    //$(id).append($('<option></option>').val("").html("--SELECT OPTION--"));
                    //$(id).append($('<option></option>').val("ALL").html("ALL"));
                    html_formation = html_formation + "<option value=''>----SELECT OPTION----</option>"
                    html_formation = html_formation + "<option value='ALL'>ALL</option>"
                } else if (hasAll === "NEW") {
                    //$(id).append($('<option></option>').val("").html("--SELECT OPTION--"));
                    // $(id).append($('<option></option>').val("NEW").html("---Create New---"));
                    html_formation = html_formation + "<option value=''>----SELECT OPTION----</option>"
                    html_formation = html_formation + "<option value='NEW'>---Create New---</option>"
                } else if (hasAll === "BLANK") {

                } else {
                    //$(id).append($('<option></option>').val("").html("--SELECT OPTION--"));
                    html_formation = html_formation + "<option value=''>----SELECT OPTION----</option>"
                }
                for (i = 0; i < json.length; i++) {
                    //alert(JSON.stringify(json[i]));
                    //$(id).append($('<option></option>').val(json[i][column_name[0]]).html(json[i][column_name[1]]));
                    html_formation = html_formation + "<option value='" + json[i][column_name[0]] + "'>" + json[i][column_name[1]] + "</option>";
                }

                $(id).html(html_formation);
                $(id).selectpicker('refresh');
            }
        }
    });
}
/**
 * 
 * @param {type} url
 * @param {type} parameters, it is array
 * @returns {void}
 */
function createlink(url, parameters) {
    var param = "";
    if (parameters.length > 0) {
        for (i = 0; i < parameters.length; i++) {
            var temp = parameters[i].split("-");
            if (i == 0) {
                param = param + "?" + temp[0] + "=" + temp[1]
            } else {
                param = param + "&" + temp[0] + "=" + temp[1]

            }
        }
    }
    return (url + param);
}

/**
 * 
 * @param {type} ajaxURL
 * @param {type} header
 * @param {type} body
 * @param {type} footer
 * @param {type} method POST / GET
 * @param {type} functionNeedToCall  the method you want to cal, the method it self pass the json..
 * @returns {json}
 */
function AjaxCallForIndividualMyDialogue(ajaxURL, header, body, footer, method, functionNeedToCall) {
    //alert(ajaxURL);
    var dialog = new BootstrapDialog({
        title: '<h3>' + header + '</h3>',
        //type: BootstrapDialog.TYPE_WARNING,
        message: '<h3>' + body + '</h3>',
        buttons: [
            {
                id: 'Yes',
                label: 'YES',
                cssClass: 'btn-success',
                action: function (dialogItself) { //if click YES then save the data
                    dialogItself.close();
                    var x = $.ajax({
                        type: method,
                        url: ajaxURL,
                        async: false,
                        beforeSend: function () {
                            $(".modal").modal('hide');
                            $("body").append("<div id='overlay' style='position:fixed;top:0;left:0;border-radius:0;height:200%;width:100%;z-index:9999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='pics/ajax-loader.gif' alt='Processing...' height='150' width='150'/></center></div>");
                        },
                        success: function (json) {
                            $("#overlay").remove();
                            functionNeedToCall(json);
                        },
                        error: function (xhr, status, error) {
                            $(".modal").modal('hide');
                            $("#overlay").remove();
                            if (status === "error") {
                                myalert("UNWANTED ERROR!", "Error Message:" + error);
                            }
                            functionNeedToCall();
                        }
                    });
                }
            },
            {
                id: 'NO',
                label: 'NO',
                cssClass: 'btn-danger',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }
        ]
    });

    dialog.realize();
    //dialog.getModalHeader().hide();
    //dialog.getModalFooter().hide();

    //$('body, html').animate({scrollTop: modal_positionY - 550});
//    alert(positionX + "---,---" + positionY + "----" + modal_positionY + "------" + scroll+"----"+scrolld);
//alert(modal_positionY);
    dialog.setSize(BootstrapDialog.SIZE_LARGE);
    //dialog.getModalBody().css('background-color', 'white');
    //dialog.getModalBody().css('color', 'blue');
    //dialog.getModalFooter().css('background-color', 'green');
    dialog.open();
    //parent.setFrameWH();
    // window.scrollTo(0,document.body.scrollHeight);
//    dialog.getModal().css({top: modal_positionY-150 ,position:"stiky"});
    if (inIframe() === "true" || inIframe()) {
        dialog.getModalDialog().css({top: modal_positionY - 150, position: "stiky"});
    }
    //dialog.css({top: modal_positionY-150 ,position:"stiky"});
    //dialog.getModalFooter().css({top: modal_positionY-150 ,position:"stiky"});
    //dialog.getModalBody().css({top: modal_positionY-150 ,position:"stiky"});
//    var a = dialog.defaultOptions;
//    alert(a.id);
//     $("#"+a.id).focus();
//    alert(JSON.stringify(p));
//    var position = p.position();
//    alert("left: " + position.left + ", top: " + position.top);
}




//$(document).on("click", function (event) {
//    var x = $(this).offset().top
//    positionX = event.pageX;
//    positionY = event.pageY;
//    alert("pageX: " + positionX + ", pageY: " + positionY + ", X:-" + x);
//});
function AjaxCallForIndividualMyDialogueWithForm(URL, header, body, footer, method, functionNeedToCall, form_id) {
//    alert(URL+form_id);
    var dialog = new BootstrapDialog({
        title: '<h3>' + header + '</h3>',
        //type: BootstrapDialog.TYPE_WARNING,
        message: '<h3>' + body + '</h3>',
        buttons: [
            {
                id: 'Yes',
                label: 'YES',
                cssClass: 'btn-success',
                action: function (dialogItself) { //if click YES then save the data
                    dialogItself.close();
                    var x = $.ajax({
                        type: method,
                        url: URL,
                        async: false,
                        data: $(form_id).serialize(),
                        cache: false,
                        dataType: "json",
                        beforeSend: function () {
                            $(".modal").modal('hide');
                            $("body").append("<div id='overlay' style='position:absolute;top:0;left:0;height:200%;width:100%;z-index:999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='pics/ajax-loader.gif' alt='Processing...' height='150' width='150'/></center></div>");
                        },
                        success: function (json) {
                            $("#overlay").remove();
                            functionNeedToCall(json);
                        },
                        error: function (xhr, status, error) {
                            $(".modal").modal('hide');
                            $("#overlay").remove();
                            if (status === "error") {
                                myalert("UNWANTED ERROR!", "Error Message:" + error);
                            }
                            functionNeedToCall();
                        }
                    });
                }
            },
            {
                id: 'NO',
                label: 'NO',
                cssClass: 'btn-danger',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }
        ]
    });
    dialog.realize();
    //dialog.getModalHeader().hide();
    //dialog.getModalFooter().hide();
    dialog.setSize(BootstrapDialog.SIZE_LARGE);
    //dialog.getModalBody().css('background-color', 'white');
    //dialog.getModalBody().css('color', 'blue');
    //dialog.getModalFooter().css('background-color', 'green');
    dialog.open();
    if (inIframe() === "true" || inIframe()) {
        dialog.getModalDialog().css({top: modal_positionY - 150, position: "stiky"});
    }
}

function getJsonValueFromAjaxCallUnaffectingModal(target_url) {
    var value = "";
    var x = $.ajax({
        type: "post",
        url: target_url,
        async: false,
        beforeSend: function () {
            //$(".modal").modal('hide');
            $("body").append("<div id='overlay' style='position:absolute;top:0;left:0;height:200%;width:100%;z-index:999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='img/busy.gif' alt='Processing...' height='150' width='150'/></center></div>");
        },
        success: function (json) {
            //$(".modal").modal('hide');
            $("#overlay").remove();
            value = json;
        },
        error: function (xhr, status, error) {
            //$(".modal").modal('hide');
            //$("#overlay").remove();
            if (status === "error") {
                myalert("UNWANTED ERROR!", "Error Message:" + error);
            }
        }
    });
    return value;
}

/**
 * 
 * @param {type} id
 * @param {type} data_placement
 * @param {type} title
 * @param {type} data_trigger
 * @param {type} data_content
 * @returns {undefined}
 */
function CustomPopOver(id, data_placement, title, data_trigger, data_content) {
//    alert("ok" + id)
    //data-placement='top' title='INFORMATION--wor' data-trigger='hover' data-content='Worked'
    $(id).attr("data-placement", data_placement);
    $(id).attr("title", title);
    $(id).attr("data-trigger", data_trigger);
    $(id).attr("data-content", data_content);
    $(".popover-title").css("background-color", "#31b0d5");
    $(".popover-title").css("color", "#FFFFFF");
    $(".popover-title").css("text-align", "center");
    $(".popover-content").css("background-color", "#fff7d7");
    $(".popover-content").css("color", "#000000");
    $(id).popover({
        html: true,
        content: function () {
            return $('#popover-content').html();
        }
    });


    /*
     $(id).popover();
     * $(id).popover({
     html: true,
     content: function() {
     return $('#popover-content').html();
     }
     });
     */
}
/**
 * 
 * @param {type} badget_class
 * @param {type} glyphycon_item
 * @param {type} description
 * @returns {undefined}
 */
function getDataContentPopOver(badget_class, glyphycon_item, description) {
    var string_format = "<span class='badge alert-" + badget_class + "'><i class='glyphicon glyphicon-" + glyphycon_item + "'></i></span> :" + description + "<br><br>";
    return string_format;
}

/**
 * 
 * @param {type} formid
 * @param {type} header
 * @param {type} body
 * @param {type} footer
 * @param {type} type_of_submit, it is eithr NON_AJAX_FORM_SUBMIT or AJAX_FORM_SUBMIT
 * @param {type} functionNeedToCall
 * @returns {void}
 */
function formSubmitMyDialogue(formid, header, body, footer, type_of_submit, functionNeedToCall) {
    var dialog = new BootstrapDialog({
        title: '<h3>' + header + '</h3>',
        //type: BootstrapDialog.TYPE_WARNING,
        message: '<h3>' + body + '</h3>',
        buttons: [
            {
                id: 'Yes',
                label: 'YES',
                cssClass: 'btn-success',
                action: function (dialogItself) { //if click YES then save the data
                    dialogItself.close();
                    if (type_of_submit === "NON_AJAX_FORM_SUBMIT") {
                        $(formid).submit();
                    } else {
                        submitForm(formid, functionNeedToCall);
                    }
                }
            },
            {
                id: 'NO',
                label: 'NO',
                cssClass: 'btn-danger',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }
        ]
    });
    dialog.realize();
    //dialog.getModalHeader().hide();
    //dialog.getModalFooter().hide();
    //dialog.setSize(BootstrapDialog.SIZE_LARGE);
    //dialog.getModalBody().css('background-color', 'white');
    //dialog.getModalBody().css('color', 'blue');
    //dialog.getModalFooter().css('background-color', 'green');
    dialog.open();
    if (inIframe() === "true" || inIframe()) {
        dialog.getModalDialog().css({top: modal_positionY - 150, position: "stiky"});
    }
}

/**
 * 
 * @param {type} id
 * @param {type} header
 * @param {type} body
 * @param {type} footer
 * @param {type} type_of_submit
 * @param {type} functionNeedToCall
 * @returns {Boolean}
 */
function formValidation(id, header, body, footer, type_of_submit, functionNeedToCall) {
    var status;
    $(id + ' input[type=text], ' + id + ' select, ' + id + ' textarea').each(
            function (index) {
                var input = $(this);
                //alert(input.attr('mytype'));
                if ((input.val() === null || input.val() === "") && (input.attr('type') !== "text") && (input.attr('mytype') !== "textArea")) {
                    //alert($('label[for="'+ input.attr('id') +'"]').text());
                    myalert("EMPTY SELECTION", "Please Choose An Option From:&nbsp&nbsp<font color='red'><b><u>" + $('label[for="' + input.attr('id') + '"]').text() + "</u></b></font>", "#" + input.attr('id'));
                    status = false;
                    return false;
                }
                if (input.val().toString().trim() === "" && (input.attr('type') === "text" || input.attr('mytype') === "textArea") && input.attr('class') !== "input-block-level form-control") {
                    myalert("EMPTY FIELD NOT ALLOWED", "Please Fillup <font color='red'><b><u>" + $('label[for="' + input.attr('id') + '"]').text() + "</u></b></font>", "#" + input.attr('id'));
                    status = false;
                    return false;
                } else {
                    status = true;
                }
            }
    );
    if (status) {
        formSubmitMyDialogue(id, header, body, footer, type_of_submit, functionNeedToCall);
    } else {
        return false;
    }
}


/**
 * 
 * @param {type} formid
 * @param {type} functionNeedToCall
 * @returns {String|json}
 */
function submitForm(formid, functionNeedToCall) {
    var target_url = $(formid).attr("action");
    var mime = "";
    var contentType_custom = "";
    var processData_custom = "";
    //var formData = "";
    //var formData = new FormData();
    //formData.append('file', $(formid+' input[type=file]')[0].files[0]);
    //var formData = new FormData($(this)[0]);
    //alert("kk---" + $("#file").val());
    var found = "N";
    $(formid + ' input[type=file]').each(
            function (index) {
                found = "Y";
            }
    );
    if (found === "Y") {
        //myalert("file found","Y");
        //mime = "multipart/form-data";
        var formData = new FormData($(formid)[0]);
        //contentType_custom = false;
        //processData_custom = false;
        var x = $.ajax({
            type: "post",
            url: target_url,
            async: false,
            data: formData,
            cache: false,
            mimeType: mime,
            contentType: false,
            dataType: "json",
            processData: false,
            beforeSend: function () {
                $(".modal").modal('hide');
                $("body").append("<div id='overlay' style='position:absolute;top:0;left:0;height:200%;width:100%;z-index:999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='pics/ajax-loader.gif' alt='Processing...' height='150' width='150'/></center></div>");
            },
            success: function (json) {
                //myalert(JSON.stringify(json));
                //alert("mime" + mime + "--formData" + formData + "--contentType_custom" + contentType_custom + "--processData_custom" + processData_custom);
//                    setTimeout(function () {
//                        $(".modal").modal('hide');
//                        if (json === null) {
//                            $("#overlay").remove();
//                            myalert("SERVER NOT RESPONDING ERROR", "Please Try After Some Time. If The Same Problem Happens Again Then Please Contact To ERP Administrator.");
//                        } else if (json.status === "N") {
//                            $("#overlay").remove();
//                            myalert("DATA NOT SAVED ERROR", "Please Try After Some Time. If The Same Problem Happens Again Then Please Contact To ERP Administrator.");
//                        } else if (json.status === "Y") {
//                            $("#overlay").remove();
//                            myalert("INFORMATION", "Operation Successfully Done.");
//                        } else if (!jQuery.isEmptyObject(json.msg) ) {
//                            $("#overlay").remove();
//                            myalert("INFORMATION", json.msg);
//                        } else if (!jQuery.isEmptyObject(json.data)) {
//                            $("#overlay").remove();
//                            //myalert("INFORMATION", json.msg);
//                        } else {
//                            $("#overlay").remove();
//                            myalert("Technical Error!", "Operation Not Done Successfully.");
//                        }
//                    }, 1000);
                $("#overlay").remove();
                functionNeedToCall(json);
            },
            error: function (xhr, status, error) {
                $(".modal").modal('hide');
                $("#overlay").remove();
                if (status === "error") {
                    myalert("UNWANTED ERROR!", "Error Message:" + error);
                }
                functionNeedToCall();
            }
        });
    } else {
        //mime = "application/json";
        //myalert("file found","N");
        formData = $(formid).serialize();
        // contentType_custom = false;
        //processData_custom = false;
        var x = $.ajax({
            type: "post",
            url: target_url,
            async: false,
            data: $(formid).serialize(),
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $(".modal").modal('hide');
                $("body").append("<div id='overlay' style='position:absolute;top:0;left:0;height:200%;width:100%;z-index:999'><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><img src='pics/ajax-loader.gif' alt='Processing...' height='150' width='150'/></center></div>");
            },
            success: function (json) {
                //alert("mime" + mime + "--formData" + formData + "--contentType_custom" + contentType_custom + "--processData_custom" + processData_custom);
//                    setTimeout(function () {
//                        $(".modal").modal('hide');
//                        if (json === null) {
//                            $("#overlay").remove();
//                            myalert("SERVER NOT RESPONDING ERROR", "Please Try After Some Time. If The Same Problem Happens Again Then Please Contact To ERP Administrator.");
//                        } else if (json.status === "N") {
//                            $("#overlay").remove();
//                            myalert("DATA NOT SAVED ERROR", "Please Try After Some Time. If The Same Problem Happens Again Then Please Contact To ERP Administrator.");
//                        } else if (json.status === "Y") {
//                            $("#overlay").remove();
//                            myalert("INFORMATION", "Operation Successfully Done.");
//                        } else if (json.msg !== null) {
//                            $("#overlay").remove();
//                            if (json.msg !== "") {
//                                myalert("INFORMATION", json.msg);
//                            }
//                        } else if (json.data !== null || json.data !== "") {
//                            $("#overlay").remove();
//                            myalert("INFORMATIONeeee", json.msg);
//                        } else {
//                            $("#overlay").remove();
//                            myalert("Technical Error!", "Operation Not Done Successfully.");
//                        }
//                    }, 1000);
                $("#overlay").remove();
                functionNeedToCall(json);
            },
            error: function (xhr, status, error) {
                $(".modal").modal('hide');
                $("#overlay").remove();
                if (status === "error") {
                    myalert("UNWANTED ERROR!", "Error Message:" + error);
                }
                functionNeedToCall();
            }
        });
    }

}

$(document).on("focusout", ".fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
});
$(document).on("keyup", ".num-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'NUM');
});
$(document).on("focusout", ".num-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'NUM');
});
$(document).on("keyup", ".float-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'FF');
});
$(document).on("focusout", ".float-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'FF');
});
$(document).on("keyup", ".nc-fields", function (e) {
    //$(this).val(($(this).val()).toUpperCase());
    tryit(this, 'NC');
});
$(document).on("focusout", ".nc-fields", function (e) {
    //$(this).val(($(this).val()).toUpperCase());
    tryit(this, 'NC');
});
$(document).on("keyup", ".sc-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'SC');
});
$(document).on("focusout", ".sc-fields", function (e) {
    $(this).val(($(this).val()).toUpperCase());
    tryit(this, 'SC');
});

function blankCall() {

}
function removeCommas(x) {
//    alert(x);
    var temp = '';
    var temp2 = '';
    //alert(x);
    var x1 = $(x).val();
    temp = x1.replace(/\,/g, '');
    if (!isNaN(temp) && temp != null) {
        temp2 = temp;
    } else {
        temp2 = "0.0";
    }
    //alert(temp2)
    return temp2;
}
function removeCommasFromValues(x) {
    //alert(x);
    var temp = '';
    var temp2 = '';
    //alert(x);
    var x1 = x;
    temp = x1.replace(/\,/g, '');
    if (!isNaN(temp) && temp != null) {
        temp2 = temp;
    } else {
        temp2 = "0.0";
    }
//    alert(temp2)
    return temp2;
}
/*ruppes to amounts word converters starts*/
//main funtion //
function convert_amount_into_rupees_paisa(amt_field_id, amt_word_field_id) {
    var val = removeCommas(amt_field_id);
    var finalWord1 = test_value(val, amt_word_field_id);
    var finalWord2 = "";
    if (val.indexOf('.') != -1) {
        val = val.substring(val.indexOf('.') + 1, val.length);
        if (val.length == 0 || val.length == '00') {
            //finalWord2 = "zero paisa only";
            finalWord2 = "Only";
        } else {
            //finalWord2 = test_value(val, amt_word_field_id) == false ? "zero paisa only" : test_value(val, amt_word_field_id) + " paisa only";
            finalWord2 = test_value(val, amt_word_field_id) == false ? "" : " and " + test_value(val, amt_word_field_id) + " Paisa";
        }
        $(amt_word_field_id).val("Rupees " + finalWord1 + finalWord2 + " Only");
    } else {
        //$(amt_word_field_id).val(finalWord1 + " Rupees Only");
        $(amt_word_field_id).val("Rupees " + finalWord1 + " Only");
    }

}

function test_value(val, amt_word_field_id) {
    var junkVal = val;
    junkVal = Math.floor(junkVal);
    var obStr = new String(junkVal);
    numReversed = obStr.split("");
    actnumber = numReversed.reverse();
    if (Number(junkVal) >= 0) {
        //do nothing
    } else {
        $(amt_word_field_id).val('');
        return false;
    }
    if (Number(junkVal) == 0) {
        $(amt_word_field_id).val(obStr + '' + 'Rupees Zero Only');
        return false;
    }
    if (actnumber.length > 9) {
        $(amt_word_field_id).val('Oops!!!! the Number is too big to covertes');
        return false;
    }
    var iWords = ["Zero", " One", " Two", " Three", " Four", " Five", " Six", " Seven", " Eight", " Nine"];
    var ePlace = ["Ten", " Eleven", " Twelve", " Thirteen", " Fourteen", " Fifteen", " Sixteen", " Seventeen", " Eighteen", "Nineteen"];
    var tensPlace = ["dummy", " Ten", " Twenty", " Thirty", " Forty", " Fifty", " Sixty", " Seventy", " Eighty", " Ninety"];
    var iWordsLength = numReversed.length;
    var totalWords = "";
    var inWords = new Array();
    var finalWord = "";
    j = 0;
    for (i = 0; i < iWordsLength; i++) {
        switch (i) {
            case 0:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                } else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j];
                break;
            case 1:
                tens_complication();
                break;
            case 2:
                if (actnumber[i] == 0) {
                    inWords[j] = '';
                } else if (actnumber[i - 1] != 0 && actnumber[i - 2] != 0) {
                    inWords[j] = iWords[actnumber[i]] + ' Hundred and';
                } else {
                    inWords[j] = iWords[actnumber[i]] + ' Hundred';
                }
                break;
            case 3:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                } else {
                    inWords[j] = iWords[actnumber[i]];
                }
                if (actnumber[i + 1] != 0 || actnumber[i] > 0) {
                    inWords[j] = inWords[j] + " Thousand";
                }
                break;
            case 4:
                tens_complication();
                break;
            case 5:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                } else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + " Lakh";
                break;
            case 6:
                tens_complication();
                break;
            case 7:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                } else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + " Crore";
                break;
            case 8:
                tens_complication();
                break;
            default:
                break;
        }
        j++;
    }
    function tens_complication() {
        if (actnumber[i] == 0) {
            inWords[j] = '';
        } else if (actnumber[i] == 1) {
            inWords[j] = ePlace[actnumber[i - 1]];
        } else {
            inWords[j] = tensPlace[actnumber[i]];
        }
    }
    inWords.reverse();
    for (i = 0; i < inWords.length; i++) {
        finalWord += inWords[i];
    }
    return finalWord;
}
function myalert(title, msg, focusid) {
//     BootstrapDialog.alert('Hi Apple!');
    var dialog = BootstrapDialog.show({
        size: BootstrapDialog.SIZE_LARGE,
        title: title,
        message: msg,
        onhidden: function (dialogRef) {
            // window.scrollTo(0, 0);
            // $("#empno").val("");
            //  $("#getdetailsbtn").trigger("click");
            $(focusid).focus();
            //alert("showed");
        },
        onshown: function (dialogRef) {
            $(this).focus();
//            alert("showed");
//            alert("showed");
//            alert("showed");
//            alert("showed");
        }

    });
    if (inIframe() === "true" || inIframe()) {
        dialog.getModalDialog().css({top: modal_positionY - 150, position: "stiky"});
    }
}

function tryit(idget, field_type) {
    //alert(idget+"-"+field_type);
    if (field_type === "NUM") {
        var node = $(idget);
        node.val(node.val().replace(/[^0-9]/g, ''));
        //$(idget).autoNumeric('init');
    } else if (field_type === "NC") {//normal Characters
        var node = $(idget);
        node.val(node.val().replace(/[^a-zA-Z0-9 _-]/g, ''));
    } else if (field_type === "SC") {//Speacial Characters
        var node = $(idget);
        node.val(node.val().replace(/[^a-zA-Z0-9.,-/?_@!&;'"\n ]/g, ''));
    } else if (field_type === "FF") {//Speacial Characters
        var node = $(idget);
        $(idget).autoNumeric('init');
        node.val(node.val().replace(/[^0-9.,]/g, ''));
        /*if ($.isNumeric(node.val()) || node.val() !== "") {
         
         } else {
         node.val('');
         myalert("information", "Please Entere Numeric Values", idget);
         }*/
    }
}

function buildTableFromJSON(json, table_div_id, table_id, serial_no_flag, small_font_flag, row_style, data_formatter_flag, data_formatter_name, data_event_name, column_alignment, column_hidden) {
    var table_font = "";
    if (small_font_flag === "Y") {
        table_font = "small";
    }
    if (json.length > 0) {
        $("#" + table_div_id).html("");
        var keys = Object.keys(json[0]);
//        var table_top = '<table  id="' + table_id + '" data-toggle="table" data-pagination="true" data-show-refresh="true"\n\
//                                         data-show-export="true" data-cache="false" data-sort-order="asc" data-height="400"  data-search="true" data-search-align="left"\n\
//                                         class="table table-responsive" data-page-list="[15,20,30,50,100,200,400,500,1000,2000,5000,10000]" data-filter-control="true" data-row-style="' + row_style + '">\n\
//                                         <thead class="bg-info">\n\
//                                         <tr>';
        var table_top = '<table  id="' + table_id + '" data-toggle="table" data-show-refresh="true"\n\
                                         data-show-export="true" data-cache="false" data-sort-order="asc" data-height="400"  data-search="true" data-search-align="left"\n\
                                         class="table table-responsive" data-filter-control="true" data-row-style="' + row_style + '">\n\
                                         <thead class="bg-info">\n\
                                         <tr>';
        var table_middle = "";
        if (serial_no_flag === "Y") {
            table_middle = table_middle + '<th data-formatter="put_slno_into_bootstraptable" data-align="center" >#</th>';
        }
        if (serial_no_flag === "C") {
            table_middle = table_middle + '<th data-field="state" data-checkbox="true" data-formatter="stateFormatter"></th>';
        }
        if (data_formatter_flag === "Y") {
            table_middle = table_middle + '<th data-formatter="' + data_formatter_name + '" data-events="' + data_event_name + '" data-align="center" class="text-uppercase">Action</th>';
        }
        for (obj in keys) {
            if (getHidden(column_hidden, keys[obj])) {
                table_middle = table_middle + '<th data-field="' + keys[obj] + '" data-sortable="true" class="text-uppercase ' + table_font + '" data-align="' + getAligment(column_alignment, keys[obj]) + '" data-filter-control="text" >' + keys[obj].replace(/_/g, " ") + '</th>';
            }
        }

        var table_lower = ' </tr>\n\
                                        </thead>\n\
                                       </table>';
        var combine = table_top + table_middle + table_lower;
        $("#" + table_div_id).html(combine);
        $("#" + table_id).bootstrapTable({data: json});

    } else {
        $(table_div_id).html("");
    }
}
function getAligment(column_lists_with_alignment, current_column_name) {
    //alert(column_lists_with_alignment[current_column_name]);
    var x = column_lists_with_alignment[current_column_name];
    if (x === 'left' || x === 'LEFT') {
        return "left";
    } else if (x === 'right' || x === 'RIGHT') {
        return "right";
    } else {
        return 'centre';
    }
}
function getHidden(column_lists_for_hide, current_column_name) {
    var val = column_lists_for_hide[current_column_name];
    //alert(current_column_name + "--->" + val);
    if (val === 'hidden') {
        return false;
    } else {
        return true;
    }
}
function put_slno_into_bootstraptable(value, row, index) {
    var count = index;
    return (parseInt(count) + 1);
}