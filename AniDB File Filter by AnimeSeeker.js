// ==UserScript==
// @name			AniDB File Filter
// @namespace		Seeker01
// @version			1.0.0
// @description     Allows you to filter files by formats and properties
// @author			Seeker
// @match			http://anidb.net/episode/*
// @match			https://anidb.net/episode/*
// @grant			none
// ==/UserScript==

// function from another userscript
function MarkOddLines(NodeList) {
	for (var i = 0; i < NodeList.length; i++) {
		if (i % 2 === 0) {
            NodeList[i].classList.remove("g_odd");
        }

        else {
            NodeList[i].classList.add("g_odd");
        }
	}
}

// function to add class="hide" to entries
function HideEntries(NodeList) {
    for (var i = 0; i < NodeList.length; i++) {
        NodeList[i].classList.add("hide");
    }
}

// function to show all entries
function ShowEntries(NodeList) {
    for (var i = 0; i < NodeList.length; i++) {
        NodeList[i].classList.remove("hide");
    }
}

// function to find entries with chapters
function FindChapters(NodeList, parameter) {
    var HideList = [];
    var FilteredList = [];

    if (parameter) {
        for (var i = 0; i < NodeList.length; i++) {
            if (!NodeList[i].querySelector("a.i_chapters")) {
                HideList.push(NodeList[i]);
            }

            else {
                FilteredList.push(NodeList[i]);
            }
        }
    }

    if (FilteredList.length == 0) {
        FilteredList = NodeList;
    }

    return [HideList, FilteredList];
}

// function to find audio and subtitle entries
function FindAudioSub(NodeList, type, parameters, filterOptions) {
    var HideList = [];
    var FilteredList = [];

    var query = "span[title*='" + type + "']";
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].value != filterOptions[i]){
            query += "[title*='" + filterOptions[i].toLowerCase() + ": " + parameters[i].value + "']";
        }
    }

    if (query != "span[title*='" + type + "']") {
        for (var i = 0; i < NodeList.length; i++) {
            if (!NodeList[i].querySelector(query)) {
                HideList.push(NodeList[i]);
            }

            else {
                FilteredList.push(NodeList[i]);
            }
        }
    }

    else {
        FilteredList = NodeList;
    }

    return [HideList, FilteredList];
}

// function to find video entries
function FindVideo(NodeList, parameters, filterOptions) {
    var HideList = [];
    var FilteredList = [];

    // filter by extension
    if (parameters[0].value != filterOptions[0]){
        for (var i = 0; i < NodeList.length; i++) {
            if (!NodeList[i].querySelector("span[title*='type: video'][title*='" + parameters[0].value + "']")) {
                HideList.push(NodeList[i]);
            }
    
            else {
                FilteredList.push(NodeList[i]);
            }
        }
    }

    // filter by codec
    if (parameters[1].value != filterOptions[1]){
        for (var i = 0; i < NodeList.length; i++) {
            if (!NodeList[i].querySelector("a[title*='video'][title*='codec: " + parameters[1].value + "']")) {
                HideList.push(NodeList[i]);
            }
    
            else {
                FilteredList.push(NodeList[i]);
            }
        }
    }

    // filter by width
    if (parameters[2].value != filterOptions[2]){
        for (var i = 0; i < NodeList.length; i++) {
            if (NodeList[i].querySelector("td.resolution").textContent.split("x")[0]) {
                if (!NodeList[i].querySelector("td.resolution").textContent.split("x")[0].includes(parameters[2].value)) {
                    HideList.push(NodeList[i]);
                }
    
                else {
                    FilteredList.push(NodeList[i]);
                }
            }
    
            else {
                HideList.push(NodeList[i]);
            }
        }
    }

    // filter by height
    if (parameters[3].value != filterOptions[3]){
        for (var i = 0; i < NodeList.length; i++) {
            if (NodeList[i].querySelector("td.resolution").textContent.split("x")[1]) {
                if (!NodeList[i].querySelector("td.resolution").textContent.split("x")[1].includes(parameters[3].value)){
                    HideList.push(NodeList[i]);
                }
    
                else {
                    FilteredList.push(NodeList[i]);
                }
            }
    
            else {
                HideList.push(NodeList[i]);
            }
        }
    }

    // filter by bit depth
    if (parameters[4].value != filterOptions[4]){
        for (var i = 0; i < NodeList.length; i++) {
            if (NodeList[i].querySelector("span[title*='bit']")) {
                if (!NodeList[i].querySelector("span[title*='bit']").textContent.includes(parameters[4].value)) {
                    HideList.push(NodeList[i]);
                }
    
                else {
                    FilteredList.push(NodeList[i]);
                }
            }

            else {
                HideList.push(NodeList[i]);
            }
        }
    }

    // filter by source
    if (parameters[5].value != filterOptions[5]){
        for (var i = 0; i < NodeList.length; i++) {
            if (NodeList[i].querySelector("td.source").textContent != parameters[5].value) {
                HideList.push(NodeList[i]);
            }
    
            else {
                FilteredList.push(NodeList[i]);
            }
        }
    }
    
    if (FilteredList.length == 0) {
        FilteredList = NodeList;
    }

    return [HideList, FilteredList];
}

// function to find entries and filter them
function FindNodes(NodeList, type, parameters, filterOptions) {
    if (type == "audio" || type == "sub") {
        parameters = parameters.querySelectorAll("select");
        return FindAudioSub(NodeList, type, parameters, filterOptions);
    }

    else if(type == "video") {
        parameters = parameters.querySelectorAll("select");
        return FindVideo(NodeList, parameters, filterOptions);
    }

    else if (type == "chapters") {
        return FindChapters(NodeList, parameters.children[1].checked);
    }
}

// function to apply filters
function ApplyFilters(NodeList, labels) {
    var Results = [];
    var HideList = [];
    var filterTypes = ["chapters", "audio", "sub", "video"];
    var filterOptions = [[],["Language", "Codec", "Channels"], ["Language", "Codec", "Type"], ["Extension", "Codec", "Width", "Height", "Bit-Depth", "Source"]];

    for (var i = 0; i < filterTypes.length; i++) {
        Results = FindNodes(NodeList, filterTypes[i], labels[i], filterOptions[i]);
        HideList = HideList.concat(Results[0]);
        NodeList = Results[1];
    }

    HideEntries(HideList);
    MarkOddLines(NodeList);

    return NodeList
}

// extract unique values using parameters
function GetUniqueValues(TitleList, parameter) {
    var finalList = [];

    for (var i = 0; i < parameter.length; i++) {
        var uniqueList = [];

        for (var j = 0; j < TitleList.length; j++) {
            if (TitleList[j].split("|")[parameter[i]]) {
                if (!uniqueList.includes(TitleList[j].split("|")[parameter[i]].split(":")[1].trim())) {
                    uniqueList.push(TitleList[j].split("|")[parameter[i]].split(":")[1].trim());
                }
            }
        }

        finalList.push(uniqueList);
    }

    return finalList
}

// extracts audio data from table
function GetAudioData(NodeList) {
    var AudioList = [];
    var TitleList = [];
    var UniqueList = [];
    
    var lang = [];
    var codec = [];
    var channels = [];

    // extract audio titles
    for (var i = 0; i < NodeList.length; i++) {
        AudioList = NodeList[i].querySelectorAll("td.lang")[0].querySelectorAll("span[title*='audio | ']");
        for (var j = 0; j < AudioList.length; j++) {
            TitleList.push(AudioList[j].getAttribute("title"));
        }
    }

    // get unique values of parameters "language", "codec" and "channels" from audio titles
    UniqueList = GetUniqueValues(TitleList, [1, 2, 3]);

    lang = UniqueList[0].sort();
    codec = UniqueList[1].sort();
    channels = UniqueList[2].sort();

    // remove "unknown" entries from "lang"
    if (lang.includes("unknown")) {
        for (var i = 0; i < lang.length - 1; i++) {
            if (lang[i] == "unknown") {
                lang.push("unknown");
                lang.splice(i, 1);
                i--;
            }
        }
    }

    return [lang, codec, channels];
}

// extracts subtitle data from table
function GetSubData(NodeList) {
    var SubList = [];
    var SubList2 = [];
    var TitleList = [];
    var TitleList2 = [];
    var UniqueList = [];
    
    var langtemp = [];
    var lang = [];
    var codec = [];
    var type = [];
    
    // extract subtitle titles
    for (var i = 0; i < NodeList.length; i++) {
        SubList = NodeList[i].querySelectorAll("td.lang")[0].querySelectorAll("span[title*='sub | ']");
        SubList2 = NodeList[i].querySelectorAll("td.lang")[0].querySelectorAll("span[title*='subtitle | ']");
        
        for (var j = 0; j < SubList.length; j++) {
            TitleList.push(SubList[j].getAttribute("title"));
        }

        for (var j = 0; j < SubList2.length; j++) {
            TitleList2.push(SubList2[j].getAttribute("title"));
        }
    }

    // get unique values of parameters "language", "codec" and "type" from ''sub' titles
    UniqueList = GetUniqueValues(TitleList, [1, 2, 3]);

    langtemp = UniqueList[0];
    codec = UniqueList[1].sort();
    type = UniqueList[2].sort();

    // get unique values of parameter "language" from 'subtitle' titles
    UniqueList = GetUniqueValues(TitleList2, [1]);
    langtemp = langtemp.concat(UniqueList[0]);
    for (var i = 0; i < langtemp.length; i++) {
        if (!lang.includes(langtemp[i])) {
            lang.push(langtemp[i]);
        }
    }

    lang.sort();

    // remove "unknown" entries from "lang"
    if (lang.includes("unknown")) {
        for (var i = 0; i < lang.length - 1; i++) {
            if (lang[i] == "unknown") {
                lang.push("unknown");
                lang.splice(i, 1);
                i--;
            }
        }
    }

    return [lang, codec, type];
}

// extracts video data from table
function GetVideoData(NodeList) {
    var ExtList = [];
    var CodecList = [];
    var ResList = [];
    var DepthList = [];
    var SourceList = [];

    var CTitleList = [];
    var ETitleList = [];
    
    var ext = [];
    var codec = [];
    var width = [];
    var height = [];
    var depth = [];
    var source = [];

    var output = [];
    
    // extract video data from titles and labels
    for (var i = 0; i < NodeList.length; i++) {
        ExtList = NodeList[i].querySelectorAll("td.codec")[0].querySelectorAll("span[title*='video | extension']");
        CodecList = NodeList[i].querySelectorAll("td.codec")[0].querySelectorAll("a[title*='video | resolution']");
        ResList = NodeList[i].querySelectorAll("td.resolution")[0];
        DepthList = NodeList[i].querySelectorAll("td.codec")[0].querySelectorAll("span[title*='bit']");
        SourceList = NodeList[i].querySelectorAll("td.source")[0].querySelectorAll("label");

        for (var j = 0; j < CodecList.length; j++) {
            CTitleList.push(CodecList[j].getAttribute("title"));
            ETitleList.push(ExtList[j].getAttribute("title"));

            // directly get unique values of parameter "source" from source labels
            if (!source.includes(SourceList[j].textContent.trim())) {
                source.push(SourceList[j].textContent.trim());
            }

            // directly get unique values of parameter "width" from resolution labels
            if (ResList.textContent.trim().split("x")[0] && !width.includes(ResList.textContent.trim().split("x")[0])) {
                width.push(ResList.textContent.trim().split("x")[0]);
            }

            // directly get unique values of parameter "height" from resolution labels
            if (ResList.textContent.trim().split("x")[1] && !height.includes(ResList.textContent.trim().split("x")[1])) {
                height.push(ResList.textContent.trim().split("x")[1]);
            }
        }

        // directly get unique values of parameter "depth" from depth spans
        for (var j = 0; j < DepthList.length; j++) {
            if (!depth.includes(DepthList[j].textContent.trim())) {
                depth.push(DepthList[j].textContent.trim());
            }
        }
    }

    // get unique values of parameters "extension" and "codec"
    ext = GetUniqueValues(ETitleList, [1])[0];
    codec = GetUniqueValues(CTitleList, [2])[0];

    output = [ext, codec, width, height, depth, source];
    
    // sort the lists and move "unknown" and "N/A" to the end
    for (var i = 0; i < output.length; i++) {
        if (i != 2 && i != 3) {
            output[i].sort();
        }

        // sort resolution list using width and height
        else {
            output[i].sort(function(a, b) {return b - a;});
        }

        if (output[i].includes("unknown") || output[i].includes("N/A")) {
            for (var j = 0; j < output[i].length - 1; j++) {
                if (output[i][j] == "unknown" || output[i][j] == "N/A") {
                    output[i].push(output[i][j]);
                    output[i].splice(j, 1);
                    j--;
                }
            }
        }
    }

    return output;
}

// https://stackoverflow.com/questions/19736663/appending-elements-to-dom-with-indentation-spacing
function indentedAppend(parent, child) {
    var indent = "", elem = parent;

    while (elem && elem !== document.body) {
        indent += "  ";
        elem = elem.parentNode;
    }

    if (parent.hasChildNodes() && parent.lastChild.nodeType === 3 && /^\s*[\r\n]\s*$/.test(parent.lastChild.textContent)) {
        parent.insertBefore(document.createTextNode("\n" + indent), parent.lastChild);
        parent.insertBefore(child, parent.lastChild);
    }
    
    else {
        parent.appendChild(document.createTextNode("\n" + indent));
        parent.appendChild(child);
        parent.appendChild(document.createTextNode("\n" + indent.slice(0, -2)));
    }
}

// function to Get Table Data and add options to drop down menus
function AddOptions(NodeList, filters) {

    //Get Audio Data
    var AudioData = GetAudioData(NodeList);
    
    //Get Subtitle Data
    var SubData = GetSubData(NodeList);
    
    //Get Subtitle Data
    var VideoData = GetVideoData(NodeList);

    // add filter options and event listener to drop down menus
    var Data = [AudioData, SubData, VideoData];

    //Get filter drop down menus
    filterMenu = filters.querySelectorAll('select');

    if (filterMenu[0].length != 1){
        // //disable filtered options
        // bugged in some cases. mostly works fine. uncomment if needed
        // for (var i = 0; i < Data.length; i++) {
        //     for (var j = 0; j < Data[i].length; j++) {
        //         for (var k = 1; k < filterMenu[(i * Data.length) + j].length; k++) {
        //             filterMenu[(i * Data.length) + j][k].disabled = false;

        //             if (!Data[i][j].includes(filterMenu[(i * Data.length) + j][k].value)) {
        //                 filterMenu[(i * Data.length) + j][k].disabled = true;
        //             }
        //         }
        //     }
        // }
    }

    else {
        //add new options
        for (var i = 0; i < Data.length; i++) {
            for (var j = 0; j < Data[i].length; j++) {
                for (var k = 0; k < Data[i][j].length; k++) {
                    option = document.createElement("option");
                    option.text = Data[i][j][k];
                    filterMenu[(i * Data.length) + j].add(option);
                }
            }
        }
    }
}

// function to apply filters
function Filter(NodeList, filters) {
    ShowEntries(NodeList);
    NodeList = ApplyFilters(NodeList, filters.querySelectorAll('label'));
    AddOptions(NodeList, filters);
}

// function to reset filters
function ResetFilters(NodeList, filters) {
    filterMenu = filters.querySelectorAll('select');

    for (var i = 0; i < filterMenu.length; i++) {
        filterMenu[i].selectedIndex = 0;
    }

    Filter(NodeList, filters);
}

// function to create drop down menus and checkbox for filters
function CreateFilterButtons(filter){
    //Move filter list outside of edit_actions and replace filter button with reset button
    var filter2 = filter.cloneNode(true);
    var editActions = filter.parentElement;
    var g_section = editActions.parentElement;
    
    filter.removeChild(filter.children[0]);
    filter2.querySelector('a').textContent = "Reset Filters";

    indentedAppend(g_section, filter);
    indentedAppend(g_section, g_section.children[2]);
    indentedAppend(editActions, filter2);
    indentedAppend(editActions, editActions.children[0]);
    
    // Create Checkbox for chapters
    var filterChapters = document.createElement('label');
    filterChapters.innerHTML = '<b>Chapters </b>';
    
    var chaptersCheckbox = document.createElement('input');
    chaptersCheckbox.type = 'checkbox';
    chaptersCheckbox.id = 'Chapters';
    filterChapters.appendChild(chaptersCheckbox);
    filter.appendChild(filterChapters);

    // Create drop down menus for filters
    var filterTypes = [" Audio ", " Subtitles ", " Video "];
    var filterOptions = [["Language", "Codec", "Channels"], ["Language", "Codec", "Type"], ["Extension", "Codec", "Width", "Height", "Bit-Depth", "Source"]];

    for (var i = 0; i < filterTypes.length; i++) {
        var filterName = document.createElement('label');
        filterName.innerHTML = '<b>' + filterTypes[i] + '</b>';
        
        for (var j = 0; j < filterOptions[i].length; j++) {
            var filterType = document.createElement('select');
            var option = document.createElement('option');
            option.text = filterOptions[i][j];
            filterType.add(option);
            indentedAppend(filterName, filterType);
        }

        filter.appendChild(filterName);
    }
}

// funciton to extract table data and create drop down menus for filters
function CreateFilters(){
    var filters = this.parentElement;

    //Create drop down menus
    CreateFilterButtons(filters);

    //Get rows from table
    var NodeList = document.querySelector('table.filelist').children[1].children;
    
    //Add options to drop down menus
    AddOptions(NodeList, filters);

    //Get filter drop down menus
    filterMenu = filters.querySelectorAll('select');

    // add event listener to drop down menus
    for (var i = 0; i < filterMenu.length; i++) {
        filterMenu[i].addEventListener('change', function(){Filter(NodeList, filters);});
    }

    // add event listener to checkbox
    filters.querySelector('#Chapters').addEventListener('change', function(){Filter(NodeList, filters);});

    // add event listener to reset button
    filters.parentElement.querySelector('div.edit_actions').children[0].addEventListener('click', function(){ResetFilters(NodeList, filters);});
}

// Create filter button. call Filter() when clicked.
function main() {
    // Get the original edit_actions div
    var editActions = document.querySelector('.ep_files').querySelector('.edit_actions');

    // Create the filter button element
    var filterButton = document.createElement('li');
    filterButton.classList.add('filter');
    filterButton.style = "height:26px;";

    var filterspan = document.createElement('span');

    var filtera = document.createElement('a');
    filtera.style = "font-size: 11px; line-height: 21px;";
    filtera.textContent = "filters";

    filterspan.appendChild(filtera);
    filterButton.appendChild(filterspan);
    filterButton.addEventListener('click', CreateFilters);

    // Create unordered list and append the filter button and existing modify button to it
    var ulElement = document.createElement('ul');
    ulElement.classList.add('g_list');
    ulElement.style = "display: inline-block; cursor: pointer;";
    ulElement.appendChild(filterButton);

    // Replace the original edit_actions div with the new ul element
    indentedAppend(editActions, ulElement);
    indentedAppend(editActions, editActions.children[0]);
}

window.addEventListener("DOMContentLoaded", main())