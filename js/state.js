const API_URL = "https://api.tarkov.dev/graphql";

const content = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

let allTasks = [];
let allItems = [];
let allHideoutStations = [];
let allTraders = [];
let allAmmo = [];

let currentSection = "home";
let hideCompletedItems = false;

let selectedTraderLevel = "all";
let traderViewMode = "sales";
let traderSearchValue = "";
let pendingTraderSearch = "";
let selectedAmmoPen = 0;
let selectedAmmoCaliber = "all";

let ammoComparison = [];

let itemsPage = 0;
const ITEMS_PER_PAGE = 40;
let currentFilteredItems = [];

let questFilterTrader = "all";
let questFilterMap = "all";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
let completedObjectives = JSON.parse(localStorage.getItem("completedObjectives")) || {};
let hideoutItemProgress = JSON.parse(localStorage.getItem("hideoutItemProgress")) || {};

let completedStorySteps = JSON.parse(localStorage.getItem("completedStorySteps")) || {};
let chosenEnding = localStorage.getItem("chosenEnding") || null;
