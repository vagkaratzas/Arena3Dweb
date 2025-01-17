// General ====================
const initializeGlobals = (RGlobalsList) => {
  MAX_LAYERS = RGlobalsList.MAX_LAYERS;
  MAX_EDGES = RGlobalsList.MAX_EDGES;
  MAX_CHANNELS = RGlobalsList.MAX_CHANNELS;
  EDGE_DEFAULT_COLOR = RGlobalsList.EDGE_DEFAULT_COLOR;
  CHANNEL_COLORS_DARK = RGlobalsList.CHANNEL_COLORS_DARK;
  CHANNEL_COLORS_LIGHT = RGlobalsList.CHANNEL_COLORS_LIGHT;
};

const startLoader = (m) => {
  let canvas_div = document.getElementById("3d-graph"),
    loader = document.getElementById("loader");
  canvas_div.style.opacity = 0.5;
  loader.style.display = "inline-block";
};

const finishLoader = (m) => {
  let canvas_div = document.getElementById("3d-graph"),
      loader = document.getElementById("loader");
  canvas_div.style.opacity = 1;
  loader.style.display = "none";
};

const changeFPS = (message) => {
  fps = Number(message);
  if (isNaN(fps))
    fps = 30;
};

const browseUrl = url => {
  window.open(url, "_blank");
};

// Scene ====================
const toggleSceneCoords = (sceneCoordsSwitch) => { // true or false
  if (scene.exists())
    scene.toggleCoords(sceneCoordsSwitch);
};

const autoRotateScene = (autoRotateFlag) => {
  if (scene.exists()) {
    scene.autoRotate = autoRotateFlag;
    if (!scene.autoRotate)
      clearInterval(scene.intervalTimeout);
  }
};

//RSHINY HANDLERS----------------------------
// General ====================
Shiny.addCustomMessageHandler("handler_initializeGlobals", initializeGlobals);
Shiny.addCustomMessageHandler("handler_startLoader", startLoader);
Shiny.addCustomMessageHandler("handler_finishLoader", finishLoader);
Shiny.addCustomMessageHandler("handler_fps", changeFPS);
Shiny.addCustomMessageHandler("handler_browseUrl", browseUrl);
// Files ====================
Shiny.addCustomMessageHandler("handler_uploadNetwork", uploadNetwork);
Shiny.addCustomMessageHandler("handler_importNetwork", importNetwork);
Shiny.addCustomMessageHandler("handler_setNodeAttributes", setNodeAttributes);
Shiny.addCustomMessageHandler("handler_setEdgeAttributes", setEdgeAttributes);
// Scene ====================
Shiny.addCustomMessageHandler("handler_toggleSceneCoords", toggleSceneCoords);
Shiny.addCustomMessageHandler("handler_autoRotateScene", autoRotateScene);
// Layers ====================
Shiny.addCustomMessageHandler("handler_showLayerCoords", showLayerCoords);
Shiny.addCustomMessageHandler("handler_floorOpacity", setFloorOpacity);
Shiny.addCustomMessageHandler("handler_showWireFrames", showWireFrames);
Shiny.addCustomMessageHandler("handler_selectAllLayers", selectAllLayers);
Shiny.addCustomMessageHandler("handler_setLayerColorPriority", setLayerColorPriority);
// Nodes ====================
Shiny.addCustomMessageHandler("handler_selectAllNodes", selectAllNodes);
Shiny.addCustomMessageHandler("handler_setNodeColorPriority", setNodeColorPriority);
Shiny.addCustomMessageHandler("handler_setNodeSelectedColorPriority", setNodeSelectedColorPriority);
Shiny.addCustomMessageHandler("handler_clickNodeColorPriority", clickNodeColorPriority);
// Edges ====================
Shiny.addCustomMessageHandler("handler_toggleDirection", toggleDirection);
Shiny.addCustomMessageHandler("handler_setIntraDirectionArrowSize", setIntraDirectionArrowSize);
Shiny.addCustomMessageHandler("handler_setInterDirectionArrowSize", setInterDirectionArrowSize);
Shiny.addCustomMessageHandler("handler_setEdgeWidthByWeight", setEdgeWidthByWeight);
Shiny.addCustomMessageHandler("handler_setIntraLayerEdgeOpacity", setIntraLayerEdgeOpacity);
Shiny.addCustomMessageHandler("handler_setInterLayerEdgeOpacity", setInterLayerEdgeOpacity);
Shiny.addCustomMessageHandler("handler_setEdgeSelectedColorPriority", setEdgeSelectedColorPriority);
Shiny.addCustomMessageHandler("handler_setEdgeFileColorPriority", setEdgeFileColorPriority);
// Channels ====================
Shiny.addCustomMessageHandler("handler_toggleIntraChannelCurvature", toggleIntraChannelCurvature);
Shiny.addCustomMessageHandler("handler_toggleInterChannelCurvature", toggleInterChannelCurvature);
// Labels ====================
Shiny.addCustomMessageHandler("handler_showLayerLabels", showLayerLabels);
Shiny.addCustomMessageHandler("handler_resizeLayerLabels", resizeLayerLabels);
Shiny.addCustomMessageHandler("handler_showNodeLabels", showNodeLabels);
Shiny.addCustomMessageHandler("handler_resizeNodeLabels", resizeNodeLabels);
// Layouts and Topology ====================
Shiny.addCustomMessageHandler("handler_executeLayout", executeLayout);
Shiny.addCustomMessageHandler("handler_setPerLayerFlag", setPerLayerFlag);
Shiny.addCustomMessageHandler("handler_setLocalFlag", setLocalFlag);
Shiny.addCustomMessageHandler("handler_scaleTopology", scaleTopology);
Shiny.addCustomMessageHandler("handler_applyPredefinedLayout", applyPredefinedLayout);
