Assignment 10: reflect on a visualization from the final Project<br>

Visualization code can be found <a href="https://github.com/esibinga/WWDdata/blob/master/main.js">here</a>.
<br>

<b>Key design details for the visualization are:</b>
<br>
<ul>
<li>Each dot represents one month's median rent cost of one area (either a neighborhood, borough, or group of neighborhoods, all listed in the dropdown) </li>
<li>The dots are colored by borough to give a quick sense that median rent is generally moving upwards and striated by borough, although there is a bit of overlap</li>
<li>This still needs a legend, which I haven’t quite figured out yet</li>
<li>Selecting a neighborhood overlays a black line over the dots, allowing for easy comparison between the highlighted neighborhood’s median rent and the general rent context of NYC</li>
<li>There are gaps in the black line for some neighborhoods, reflecting a lack of data for neighborhoods that haven’t always had a presence on Street Easy</li>
<li>Some things that I did intentionally: changing the font consistently to create a unified appearance; picking colors for the dots that look balanced and not “pre-packaged”; choosing the thickness of the black line that makes it readable but not clunky; using CSS columns so that the dropdown menu doesn’t block the graph when clicked </li> </ul>
<br>
I like this as a way to see individual dots/variation and also compare trends. The data is overwhelming and basically unreadable with no color distinction, but coloring by borough is a great familiar sub-category that gets more granular while still allowing for discovery of the particulars of neighborhood-level data. Also, having dots AND a line, rather than all lines or all dots, allows for better visual comparison. One UI component that would improve the visualization is to have the trend line and neighborhood line show up when a user hovers. This would allow for comparison of different neighborhoods against the dropdown option, and also answer obvious user questions like “which neighborhood does XYZ dot belong to?”<br>
The most important text to reiterate (which I could begin to address with a chart title) is that <b>this is StreetEasy data, not actual rental data.</b> That’s most obvious when you realize that 1. only one Staten Island neighborhood appears on the map (it’s dark green, and barely visible) and 2. The Bronx seems to only become a real place in 2013. It’s also interesting to see neighborhoods like Tremont (below) which appear on the visualization in the middle of the time scale.
<br>
The Tremont detail tells a more interesting story about StreetEasy’s expansion, and what that might represent, than about comprehensive median rent data for NYC. That’s something I want to get at in the narrative, but could also bring into the image in a few ways. Descriptive title and source data linked back to StreetEasy are the most straightforward, but another simple visualization, like a stacked bar chart, that shows what percentage of the neighborhoods in each borough are actually listed on SE would also help to represent what is left out of the median rent visualization. 