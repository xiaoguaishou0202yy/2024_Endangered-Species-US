#  Endangered Species Throughout U.S. States
An interactive web map and data visualization tool, offering a comprehansive view of the current state of endangered species throughtout the United States

## Team Members
Zhiyi Li and Xun Gong

## Final Proposal
### Target user profile (persona):
**Name & Position:** **Alex Morgan, Environmental Educator**     
**Background Description:** 
The following scenario describes the use of Endangered Species Tracker for United States by Alex Morgan, a didicated environmental educator preparing to engage middle school students in understanding biodiversity and the significance of conservation efforts. Traditional educational materials, often laden with dense text and complex tables, prove ineffective in capturing the attention of young learners and are inadequate for conveying the nuances of endangered species' numbers, locations, and conservation statuses directly and engagingly. Alex, deeply committed to endangered species protection and environmental activism, uses the web map as a centralized and accurate **<ins>resource</ins>** for data on endangered, threatened, recovered, and extinct species. Facing the challenge of presenting complex conservation statuses and species distribution in an educational setting, Alex plans to use the map not just for **<ins>data exploration</ins>** but also as a **<ins>presentation tool</ins>** to illustrate complex **<ins>trends</ins>** and **<ins>clusters</ins>** in biodiversity. The web map is designed to be accessible on multiple devices, ensuring Alex can access and display information fluidly in diverse environments such as classrooms or outdoor settings. With features like an Introduction Panel, Chart Toggle, Search Widget, Information Panel, and flexible Map Operations, Alex aims to **<ins>retrieve</ins>** and **<ins>filter</ins>** specific data, **<ins>compare</ins>** and **<ins>analyze</ins>** patterns shown on the map, making conservation issues more visible and engaging for students. By leveraging this Endangered Species Tracker for the United States, Alex seeks to enhance his educational outreach, making a substantial impact on young minds by raising awareness about the critical need for conservation efforts to protect our planet's biodiversity.      
### User case scenarios: 
**Scenario #1:** 
Upon launching the Endangered Species Tracker, Alex Morgan, an environmental educator, is set to engage a class of middle school students in California on the topic of biodiversity and conservation. The classroom's smartboard displays the tracker's interface, featuring a map marked with proportional symbols that indicate the number of endangered species in each U.S. state. Captivated by the visual display, students are invited by Alex to **<ins>explore</ins>** the map. As they select California, **<ins>details</ins>** about specific species groups in California appear on the right panel, enriching their understanding of local biodiversity. Alex then uses the adjacent bar chart, "Number of Grand Total in each state," to facilitate a **<ins>comparative</ins>** analysis. He explains the significance of the data, particularly highlighting Hawaii, which has the highest level of endangered species, to underscore the urgency of conservation efforts. Next, Alex demonstrates the "Search for a state" feature, which allows students to find data on states they are curious about, thereby personalizing their learning experience. This interactive exploration culminates in a class discussion about potential conservation actions, emphasizing the role of environmental policies and personal efforts in species preservation. To reinforce the day's learning, Alex assigns a project where students will use the Endangered Species Tracker to research the species in a state of their interests. students will share their discoveries and thoughts in an open discussion next class. This scenario showcases how the Endangered Species Tracker not only serves as an educational tool but also as a means to foster environmental awareness and proactive engagement among students.

**Scenario #2:**
   Upon visiting the interactive website, the user is greeted with a vibrant array of features designed to deepen their understanding of endangered species and the efforts undertaken to conserve them. They begin by exploring the various conservation measures detailed on the site, each accompanied by rich, multimedia content that brings to light the complex processes involved in safeguarding these species. This journey through conservation strategies reveals a blend of science, policy, and community involvement, showcasing projects from habitat restoration to anti-poaching campaigns.
   As the user delves further, they discover a section dedicated to the stories behind the discovery of endangered species. These narratives, enriched with photos, videos, and firsthand accounts, offer a personal look into the lives of the animals and the dedicated individuals who study and protect them. The website facilitates a connection between the user and these distant realities, turning abstract statistics into tangible stories of survival and perseverance. By the end of their visit, the user not only gains a wealth of knowledge on the topic of conservation but also walks away with a renewed sense of responsibility and a desire to contribute to the protection of our planet’s biodiversity. This interactive experience fosters a deeper emotional engagement with environmental conservation, encouraging users to become advocates for endangered species in their own communities.
### Requirements Document
 1. Representation
    1. Basemap: The outline boundary of the World's Countries and the United States (state boundary included): natural earth
    2. Listed species with spatial current range believed to or known to occur in each state: https://ecos.fws.gov/ecp/report/species-listings-by-state-totals?statusCategory=Listed     
       Organize this data into two CSV files:
       1. Species lists in each state, including detailed information like Scientific Name, Common Name, Status...
       2. Number of species in each group based on states
    3. Overview: Introduction and supplementary text on the background description and user guideline
    4. Statistics: Create a bar chart displaying the number of endangered species in each state.

 2. Interaction
    1. Introduction Panel: Overlay: Show intro info
    2. Query Panel: Filter: By species group.
    3. Chart Toggle: Overlay: Turn on/off the charts showing statistics information; Reexpress: use charts show some information including in the map 
    4. Search Widget: Search: Search for state of interest
    5. Information Panel: Retrieve: Show more information about the species when clicking on a specific state
    6. Map Operations: Zoom: Flexible for zooming; click on the reset button to reset the map; Pan: Flexible for paning; click on the reset button to reset the map

*Other Reference:*  
     
*Interactive map example of related topics: https://center.maps.arcgis.com/apps/webappviewer/index.html?id=def877f10b304220beab7ee8b19f1533* 
     
*Endangered species habitats:*      
*The distribution of different endangered species from Environmental Conservation Online System: USFWS Threatened & Endangered Species Active Critical Habitat Report: https://ecos.fws.gov/ecp/report/critical-habitat; Current Range of All Species: https://ecos.fws.gov/ecp/species/2776*     

*Current Listed Species Summary from Environmental Conservation Online System: https://ecos.fws.gov/ecp/report/boxscore*



### Wireframes
![919539858baaa18fa05f01ad9c1bf88](https://github.com/xiaoguaishou0202yy/2024_Endangered-Species-US/assets/158022313/0103f4fb-812a-44c4-91c3-92c1a17a98b2)










