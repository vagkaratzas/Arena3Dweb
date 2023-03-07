// Global Objects
let scene; // TODO add rest here

// initializing static variables
let animationRunning = false, //flag to ensure animation function only executes once!
    animationPause = false, //user button from Shiny to pause rendering at any moment
    axisPressed = "",
    previousX = 0, //variable to calculate drag and orbit controls
    previousY = 0, //variable to calculate drag and orbit controls
    sphereRadius = 8,
    attachedCanvasControls = false,
    labelSwitch = false,
    selectedLabelSwitch = true,
    selectedLayerLabelSwitch = false,
    layerLabelSwitch = true,
    edgeWidthByWeight = true,
    wireframeFlag = false,
    nodeAttributesPriority = true,
    selectedNodeColorFlag = true,
    selectedEdgeColorFlag = true,
    edgeAttributesPriority = true,
    localLayoutFlag = false,
    isDirectionEnabled = false,
    layerColorFile = true,
    layerEdgeOpacity = 1,
    interLayerEdgeOpacity = 0.4,
    directionArrowSize = 0.03,
    intraDirectionArrowSize = 0.08,
    channelCurvature = 0.05,
    interChannelCurvature = 0.05,
    floorOpacity = 0.6,
    fps = 30,
    MAX_EDGES = "",
    MAX_CHANNELS = "",
    MAX_LAYERS = "",
    channel_colors = [],
    CHANNEL_COLORS_LIGHT = [],
    CHANNEL_COLORS_DARK = [],
    floorDefaultColors = [],
    floorDefaultColor = "#777777",
    floorCurrentColor = floorDefaultColor,
    globalLabelColor = "#ffffff",
    selectedDefaultColor = "#A3FF00",
    edgeDefaultColor = "#CFCFCF",
    nodeLabelDefaultSize = "12px",
    draw_inter_edges_flag = true,
    downstreamCheckedNodes = [], // for 3rd option of onRightClick on node
    drag_controls; // for dragging
    
// Variables that are being refreshed on new network upload/import (nodes, edges, coords)
let nodes = [], //canvas objects
    node_labels = [], //divs to be overlaid above canvas
    node_names = [],
    node_whole_names = [],
    node_label_flags = [],
    hovered_nodes = [], // if allowing more than one hovered nodes at a time
    last_hovered_node_index = "",
    last_hovered_layer_index = "",
    edges = [], //canvas objects
    layerEdges = [], //canvas objects
    edge_pairs = [],
    layer_edges_pairs = [], //canvas objects
    layer_edges_pairs_channels = [],
    edge_values = [],
    edge_channels = [],
    layerCoords = [],
    node_groups = new Map(),
    layer_groups = new Map(),
    layer_labels = [], //divs
    layer_names = [],
    layer_node_labels_flags = [],
    x = [],
    y = [],
    z = [],
    layer_planes = [],
    layer_spheres = [],
    js_selected_layers = [],
    selectedNodePositions = [],
    selected_edges = [],
    channels_layout = [],
    shiftX = "",
    shiftY = "",
    lasso = "",
    lights = [],
    ambientLight = "",
    optionsList = "",
    node_cluster_colors = [],
    node_attributes = "",
    edge_attributes = "",
    last_layer_scale = [],
    channels = [],
    channel_color = {},
    channelVisibility = {},
    timeoutF;

// for Raycasting
const raycaster = new THREE.Raycaster();
const vector = new THREE.Vector3();
const dir = new THREE.Vector3();


let colors = [];
const darkColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628","#f781bf", "#999999"];
const lightColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#000000"];
const grayColors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628","#f781bf", "#000000"];
//280 colors
const default_colors = ["#14a9ad", "#4ca2f9", "#a4e43f", "#d298e2", "#6119d0",
  "#d2737d", "#c0a43c", "#f2510e", "#651be6", "#79806e", "#61da5e", "#cd2f00", 
  "#9348af", "#01ac53", "#c5a4fb", "#996635", "#b11573", "#4bb473", "#75d89e", 
  "#2f3f94", "#2f7b99", "#da967d", "#34891f", "#b0d87b", "#ca4751", "#7e50a8", 
  "#c4d647", "#e0eeb8", "#11dec1", "#289812", "#566ca0", "#ffdbe1", "#2f1179", 
  "#935b6d", "#916988", "#513d98", "#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
  "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
  "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
  "#5be4f0", "#57c4d8", "#a4d17a", "#225b80", "#be608b", "#96b00c", "#088baf",
  "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
  "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
  "#fb21a3", "#51aed9", "#5bb32d", "#807fb0", "#21538e", "#89d534", "#d36647",
  "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
  "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
  "#1bb699", "#6b2e5f", "#64820f", "#1c2710", "#21538e", "#89d534", "#d36647",
  "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
  "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
  "#1bb699", "#6b2e5f", "#64820f", "#1c2710", "#9cb64a", "#996c48", "#9ab9b7",
  "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
  "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
  "#8fe22a", "#ef6e3c", "#243eeb", "#1dc180", "#dd93fd", "#3f8473", "#e7dbce",
  "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
  "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
  "#32d5d6", "#172320", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
  "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
  "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
  "#28fcfd", "#bb09b0", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
  "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
  "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
  "#615af0", "#4be470", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
  "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
  "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
  "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff0650",
  "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
  "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
  "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b670",
  "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
  "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
  "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"];
