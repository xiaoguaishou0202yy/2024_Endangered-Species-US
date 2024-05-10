#  Endangered Species Across U.S. States
SpeciesW

## Team Members
1. Zhiyi Li
2. Xun Gong

## Final Proposal
### Target user profile (persona):
**Name & Position:** Alex Morgan, Environmental Educator     
**Background Description:** 
The following scenario describes the use of a web map by Alex Morgan, an environmental educator preparing to engage middle school students on the importance of biodiversity and conservation efforts. Alex, deeply committed to endangered species protection and environmental activism, uses the web map as a centralized and accurate resource for data on endangered, threatened, recovered, and extinct species across both flora and fauna. Facing the challenge of presenting complex conservation statuses and species distribution in an educational setting, Alex plans to use the map not just for exploration but also as a presentation tool to illustrate complex trends and clusters in biodiversity. The web map is designed to be accessible on multiple devices, ensuring Alex can access and display information fluidly in diverse environments such as classrooms or outdoor settings. With features like an Introduction Panel, Query Panel, Chart Toggle, Search Widget, Information Panel, and flexible Map Operations, Alex aims to <ins>retrieve</ins> and filter specific data, analyze patterns shown on the map, and make conservation issues more visible and engaging for students. By leveraging this technology, Alex seeks to enhance his educational outreach, making a substantial impact on young minds by raising awareness about the critical need for conservation efforts to protect our planet's biodiversity.      
### User case scenarios: 
**Scenario #1:**
   Upon arriving at the interactive website, Alex can quickly find detailed, reliable information about various endangered species for lesson planning, gathering information on different species listed as endangered or critically endangered. And then, utilizing the interactive map features to show students where these species are located in U.S., highlighting the diversity of life and the ecosystems. Moreover, Alex can access the interactive to discover detailed measures and processes involved in the conservation of endangered species. He can delve into the fascinating stories behind the discovery of these vulnerable creatures, gaining insights into their natural habitats, the challenges they face, and the relentless efforts of conservationists to protect them. Evolving these stories into his speech to activate students’ interest and inspire a deeper understanding to wildlife conservation among audiences.     
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
![0eb1c640018ba680e8be3389cbbaaa8](https://github.com/xiaoguaishou0202yy/2024_Endangered-Species-US/assets/158022313/626024fd-8c5e-4112-852b-2936d3fee11c)
![IMG_6632](https://github.com/xiaoguaishou0202yy/2024_Endangered-Species-US/assets/157653332/5fd5114a-d298-4e23-a977-637c380aa1e6)
![52dfe022b14cac3f4955fe296314419](https://github.com/xiaoguaishou0202yy/2024_Endangered-Species-US/assets/158022313/ea3dcfea-09c9-4f2e-b72c-47005992ed44)










