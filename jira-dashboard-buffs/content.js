// Work in progress.  This will eventually become a bunch of related JIRA buffs
// to make life easier.  At this point things are pretty hard-coded in places.
//
// So far:
//      1) Re-colors Issue Status pie charts (for certain statuses).  Limited for now to English and to commonly used status names (New, In Progress, etc.).
//      2) Enhances tooltips for Pie Chart and Filter Results gadgets to include the filter name instead of just "Pie Chart" etc.  Useful for multi-column dashboards.

//console.log("beep bop boop");

//I'm using the Atlassian palette: https://atlassian.design/guidelines/product/foundations/color
var red = "#FF5630";
var yellow = "#FFAB00";
var green = "#36B37E";
var blue = "#00B8D9";
var purple = "#6554C0";


//run on page load, then listen for changes to the gadget divs.  The latter solves:
//  * resize
//  * gadgets loading well after page load when performance isn't snappy

runDashboardFixes();
setupListeners();

//var runDashboardFizesOnResize = _.debounce(runDashboardFixes, 250);

//window.addEventListener('resize', runDashboardFizesOnResize);

function setupListeners(){

    var gadgetDivs = document.querySelectorAll("div.gadget");
    var divArray = Array.from(gadgetDivs);

    var observer = new MutationObserver(runDashboardFixes);

    divArray.forEach(function(el){
            console.log("observing ...");
            observer.observe(el, {childList : true, subtree: true} );

    });

}


//Runs the various fixes provided by the plugin.  
//This actually gets run a bit more often than needed - any time any gadgets on the 
//page change.  But it's not often enough to need performance tweaking - with 10 gadgets
//we might update 20 times on initial page load.
function runDashboardFixes() {

    //console.log("Running fixes ... ");

    // Fix pie chart colors
    setPieSliceColor("New", red);
    setPieSliceColor("In Progress", yellow);
    setPieSliceColor("Done", green);
    setPieSliceColor("Closed", green);
    setPieSliceColor("In Test", blue);
    setPieSliceColor("Awaiting Deployment", purple);


    // Fix tooltips for all the pie charts
    enhanceGadgetTooltips("Pie Chart");

    //And why not ... the filter results gadget.
    enhanceGadgetTooltips("Filter Results");

}

// This finds a pie chart slice corresponding to the passed text value and 
// sets the following to the suggested color:
//  * the pie slice itself.
//  * the item in the legend.
//  * the text that appears in the middle of the pie (ring) when the user hovers over a slice.
function setPieSliceColor(text, color) {

    //find the slice
    var slice = $("g.piechart-arc:contains('" + text + "')");

    //the slice
    slice.children("path").css('fill', color);

    //set color for the hover text
    slice.children("text.piechart-center-primary").css('fill', color);

    //find the legend item 
    var legendItem = $("div.legend-item-wrapper:contains('" + text + "')");

    //set color for the legend item
    legendItem.children("div.piechart-fill").css('background-color', color);

}

/*
    A lot of JIRA gadgets have tooltips for the gadget header that say "Pie Chart" or some other 
    generic text.  If you have multi-column dashboards or long search filter names, the actual header
    text may cut off.  This updates the tooltip to match the full header text. 

    Inputs:

        gadgetType: Whatever the old, generic tooltip says.  Obviously this is English-only at the moment.

*/
function enhanceGadgetTooltips(gadgetType)
{
    pieChartTitles = $("h3.dashboard-item-title:contains('" + gadgetType + "')").each(function( index) {
        var newTitle = $(this).text();
        $(this).attr('title', newTitle);
    });


}