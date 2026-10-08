const albums = [
  {
    id:"live", title:"LIVE.LOVE.A$AP", year:"2011",
    desc:"Mixtape debut: atmósferas cloud, raíces de Harlem y una fuerte conexión con el sonido sureño.",
    tracks:"“Palace” · “Peso” · “Purple Swag” · “Wassup”",
    search:"LIVE.LOVE.A$AP A$AP Rocky"
  },
  {
    id:"long", title:"LONG.LIVE.A$AP", year:"2013",
    desc:"Debut de estudio que llevó su estética a una escala mainstream sin perder su oscuridad.",
    tracks:"“Goldie” · “F**kin' Problems” · “Wild for the Night” · “1 Train”",
    search:"LONG.LIVE.A$AP A$AP Rocky"
  },
  {
    id:"atlong", title:"AT.LONG.LAST.A$AP", year:"2015",
    desc:"Un giro más psicodélico y expansivo, con producción ejecutiva de Danger Mouse, Juicy J, Rocky y A$AP Yams.",
    tracks:"“L$D” · “Everyday” · “Lord Pretty Flacko Jodye 2” · “Canal St.”",
    search:"AT.LONG.LAST.A$AP A$AP Rocky"
  },
  {
    id:"testing", title:"TESTING", year:"2018",
    desc:"La etapa experimental: texturas, estructuras menos convencionales y una búsqueda explícita de nuevas formas.",
    tracks:"“A$AP Forever” · “Praise The Lord” · “Fukk Sleep” · “Kids Turned Out Fine”",
    search:"TESTING A$AP Rocky"
  },
  {
    id:"dbd", title:"DON'T BE DUMB", year:"2026",
    desc:"Cuarto álbum de estudio, publicado en enero de 2026, que continúa la etapa de colaboraciones y exploración sonora.",
    tracks:"“PLAYA” · “STAY HERE 4 LIFE” · “WHISKEY” · “ROBBERY”",
    search:"Don't Be Dumb A$AP Rocky"
  }
];

const timelineData = {
  "2011":{
    title:"El despegue de Pretty Flacko",
    text:"“Peso” y LIVE.LOVE.A$AP pusieron a Rocky en el mapa: un sonido híbrido entre Harlem y el Sur de EE. UU., acompañado por una identidad visual que lo diferenciaba de inmediato."
  },
  "2013":{
    title:"LONG.LIVE.A$AP",
    text:"Su debut de estudio llegó en enero de 2013. El álbum alcanzó el número 1 del Billboard 200 y convirtió el lenguaje de Rocky en una propuesta de gran alcance."
  },
  "2015":{
    title:"AT.LONG.LAST.A$AP",
    text:"La segunda etapa amplió el universo psicodélico y colaborativo de Rocky. Danger Mouse y Juicy J participaron como productores ejecutivos junto a Rocky y A$AP Yams."
  },
  "2018":{
    title:"TESTING",
    text:"TESTING llevó la experimentación al centro del concepto: producción mutante, colaboraciones inesperadas y una voluntad explícita de probar ideas nuevas."
  },
  "2024–26":{
    title:"Nueva era: DON'T BE DUMB",
    text:"Tras nuevos singles y colaboraciones, DON'T BE DUMB llegó en enero de 2026 como su cuarto álbum de estudio, con una nueva fase de proyectos y colaboraciones."
  }
};

const eraMessages = {
  live:"Eres de la primera hora: estética nocturna, cloud rap y el aura de Harlem antes del mainstream. Tu punto de entrada: “Peso” y “Purple Swag”.",
  long:"Te quedas con el equilibrio entre culto y blockbuster. Tu era mezcla “Goldie”, “1 Train” y “F**kin' Problems” con una identidad ya global.",
  atlong:"Prefieres el Rocky más psicodélico y cinematográfico. “L$D”, “Everyday” y “Canal St.” representan una etapa expansiva y melódica.",
  testing:"Tu Flacko favorito es el laboratorio: producción experimental, texturas raras y la idea de que un álbum de rap también puede funcionar como test de sonido."
};

const STORAGE_KEY = "prettyFlackoExperience";
const state = {
  gallery: [],
  galleryIndex: 0,
  draggedId: null,
  albums: [...albums]
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initReveal();
  initTimeline();
  renderAlbums();
  initAlbumButtons();
  initGallery();
  initFanZone();
  initRanking();
  initForm();
  initStorage();
  loadAlbumArtwork();
});

function initNavigation(){
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
    toggle.setAttribute("aria-label","Abrir menú");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  $$("#mainNav a").forEach(link => link.addEventListener("click", closeMenu));

  // Scroll interaction: adds compact header shadow while scrolling.
  const header = $(".site-header");
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 30 ? "0 12px 35px rgba(0,0,0,.25)" : "none";
  }, {passive:true});
}

function initReveal(){
  const elements = $$(".reveal");
  if(!("IntersectionObserver" in window)){
    elements.forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  elements.forEach(el => observer.observe(el));
}

function initTimeline(){
  const buttons = $$(".timeline-item");
  const year = $("#detailYear");
  const title = $("#detailTitle");
  const text = $("#detailText");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-expanded","false");
      });
      button.classList.add("active");
      button.setAttribute("aria-expanded","true");
      const data = timelineData[button.dataset.year];
      year.textContent = button.dataset.year;
      title.textContent = data.title;
      text.textContent = data.text;
    });
  });
}

function renderAlbums(){
  const grid = $("#albumGrid");
  grid.innerHTML = albums.map(album => `
    <article class="album-card reveal" data-album="${album.id}">
      <div class="album-cover">
        <div class="album-cover-fallback">${escapeHtml(album.title)}<small>${album.year} · A$AP ROCKY</small></div>
        <img class="album-art" data-search="${escapeHtml(album.search)}" alt="Portada de ${escapeHtml(album.title)}" loading="lazy" hidden>
      </div>
      <div class="album-body">
        <span class="album-year">${album.year}</span>
        <h3>${escapeHtml(album.title)}</h3>
        <p>${escapeHtml(album.desc)}</p>
        <button class="album-more" type="button" aria-expanded="false">Ver más</button>
        <div class="album-extra"><strong>Tracks:</strong> ${escapeHtml(album.tracks)}</div>
      </div>
    </article>
  `).join("");
  initReveal();
}

function initAlbumButtons(){
  $("#albumGrid").addEventListener("click", event => {
    const button = event.target.closest(".album-more");
    if(!button) return;
    const card = button.closest(".album-card");
    const expanded = card.classList.toggle("expanded");
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Ver menos" : "Ver más";
  });
}

async function loadAlbumArtwork(){
  const imgs = $$(".album-art");
  for(const img of imgs){
    try{
      const term = encodeURIComponent(img.dataset.search);
      const response = await fetch(`https://itunes.apple.com/search?term=${term}&entity=album&limit=10&country=US`);
      if(!response.ok) throw new Error("iTunes API error");
      const data = await response.json();
      const exact = data.results.find(item => item.collectionName?.toLowerCase().replace(/[^\w]/g,"").includes(img.dataset.search.split(" A$AP")[0].toLowerCase().replace(/[^\w]/g,""))) || data.results[0];
      if(exact?.artworkUrl100){
        img.src = exact.artworkUrl100.replace("100x100","600x600");
        img.hidden = false;
        img.previousElementSibling.style.display = "none";
      }
    }catch(error){
      // Fallback CSS artwork remains visible; no broken image is shown.
      console.warn("No se pudo cargar la portada:", error);
    }
  }
}

function initGallery(){
  $("#loadImagesBtn").addEventListener("click", loadCommonsImages);
  loadCommonsImages();

  $("#modalClose").addEventListener("click", closeModal);
  $("#modalPrev").addEventListener("click", () => moveModal(-1));
  $("#modalNext").addEventListener("click", () => moveModal(1));
  $("[data-close-modal]").addEventListener("click", closeModal);

  document.addEventListener("keydown", event => {
    const modal = $("#imageModal");
    if(modal.hidden) return;
    if(event.key === "Escape") closeModal();
    if(event.key === "ArrowLeft") moveModal(-1);
    if(event.key === "ArrowRight") moveModal(1);
  });
}

async function loadCommonsImages(){
  const loading = $("#galleryLoading");
  const status = $("#apiStatus");
  const grid = $("#galleryGrid");
  const empty = $("#galleryEmpty");
  loading.hidden = false;
  empty.hidden = true;
  status.className = "status-pill loading";
  status.textContent = "Cargando API…";
  grid.setAttribute("aria-busy","true");
  try{
    const endpoint = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=A%24AP%20Rocky&gsrnamespace=6&gsrlimit=14&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=1000&format=json&origin=*";
    const response = await fetch(endpoint);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const usable = pages.filter(page => {
      const info = page.imageinfo?.[0];
      return info?.thumburl && /^image\/(jpeg|png|webp)/i.test(info.mime || "");
    });
    state.gallery = usable.map(page => {
      const info = page.imageinfo[0];
      const metadata = info.extmetadata || {};
      return {
        src: info.thumburl,
        full: info.url,
        title: page.title.replace(/^File:/,""),
        artist: stripHtml(metadata.Artist?.value || "Wikimedia Commons"),
        license: stripHtml(metadata.LicenseShortName?.value || "Licencia indicada en Commons")
      };
    });
    renderGallery();
    status.className = "status-pill";
    status.textContent = `${state.gallery.length} imágenes · API conectada`;
  }catch(error){
    console.error(error);
    state.gallery = [];
    grid.innerHTML = "";
    empty.hidden = false;
    status.className = "status-pill error";
    status.textContent = "Error de API";
  }finally{
    loading.hidden = true;
    grid.removeAttribute("aria-busy");
  }
}

function renderGallery(){
  const grid = $("#galleryGrid");
  if(!state.gallery.length){
    $("#galleryEmpty").hidden = false;
    return;
  }
  grid.innerHTML = state.gallery.map((item,index) => `
    <button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="Ampliar ${escapeHtml(item.title)}">
      <img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy">
      <span class="gallery-overlay">${escapeHtml(item.title)}</span>
    </button>
  `).join("");
  $$(".gallery-item", grid).forEach(item => {
    item.addEventListener("click", () => openModal(Number(item.dataset.galleryIndex)));
  });
}

function openModal(index){
  if(!state.gallery.length) return;
  state.galleryIndex = (index + state.gallery.length) % state.gallery.length;
  const modal = $("#imageModal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  updateModal();
  $("#modalClose").focus();
}
function updateModal(){
  const item = state.gallery[state.galleryIndex];
  $("#modalImage").src = item.full || item.src;
  $("#modalImage").alt = item.title;
  $("#modalCaption").textContent = `${item.title} · ${item.license} · ${item.artist}`;
}
function closeModal(){
  const modal = $("#imageModal");
  if(modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}
function moveModal(direction){
  if($("#imageModal").hidden || !state.gallery.length) return;
  state.galleryIndex = (state.galleryIndex + direction + state.gallery.length) % state.gallery.length;
  updateModal();
}

function initFanZone(){
  const result = $("#eraResult");
  $$(".era-btn").forEach(button => {
    button.addEventListener("click", () => {
      $$(".era-btn").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      result.textContent = eraMessages[button.dataset.era];
      saveState({era:button.dataset.era});
    });
  });
}

function initRanking(){
  renderRanking();
  $("#resetRankingBtn").addEventListener("click", () => {
    state.albums = [...albums];
    renderRanking();
    saveState({ranking:state.albums.map(a=>a.id)});
  });
}
function renderRanking(){
  const list = $("#rankingList");
  list.innerHTML = state.albums.map((album,index) => `
    <li class="rank-card" draggable="true" tabindex="0" data-id="${album.id}" aria-label="${index+1}. ${escapeHtml(album.title)}">
      <span class="rank-medal">${index < 3 ? ["🥇","🥈","🥉"][index] : `${index+1}.`}</span>
      <span class="rank-name">${escapeHtml(album.title)}</span>
      <span class="rank-year">${album.year}</span>
    </li>
  `).join("");
  $$(".rank-card", list).forEach(card => {
    card.addEventListener("dragstart", () => {
      state.draggedId = card.dataset.id;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      state.draggedId = null;
      card.classList.remove("dragging");
      $$(".rank-card", list).forEach(c=>c.classList.remove("drag-over"));
    });
    card.addEventListener("dragover", event => {
      event.preventDefault();
      if(card.dataset.id !== state.draggedId) card.classList.add("drag-over");
    });
    card.addEventListener("dragleave", () => card.classList.remove("drag-over"));
    card.addEventListener("drop", event => {
      event.preventDefault();
      reorder(state.draggedId, card.dataset.id);
    });
    card.addEventListener("keydown", event => {
      if(event.key !== "Enter") return;
      const index = state.albums.findIndex(a=>a.id===card.dataset.id);
      if(index < state.albums.length - 1){
        [state.albums[index],state.albums[index+1]] = [state.albums[index+1],state.albums[index]];
        renderRanking();
        saveState({ranking:state.albums.map(a=>a.id)});
        $("#rankingList .rank-card")[Math.min(index+1,state.albums.length-1)].focus();
      }
    });
  });
}
function reorder(draggedId,targetId){
  if(!draggedId || draggedId===targetId) return;
  const from = state.albums.findIndex(a=>a.id===draggedId);
  const to = state.albums.findIndex(a=>a.id===targetId);
  const [moved] = state.albums.splice(from,1);
  state.albums.splice(to,0,moved);
  renderRanking();
  saveState({ranking:state.albums.map(a=>a.id)});
}

function initForm(){
  const form = $("#fanForm");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#fanName").value.trim();
    const album = $("#favoriteAlbum").value;
    const song = $("#favoriteSong").value.trim();
    const errors = {
      name: !name ? "Escribe tu nombre." : "",
      album: !album ? "Selecciona un álbum." : "",
      song: !song ? "Escribe tu canción favorita." : ""
    };
    $("#nameError").textContent = errors.name;
    $("#albumError").textContent = errors.album;
    $("#songError").textContent = errors.song;
    const valid = !Object.values(errors).some(Boolean);
    const message = $("#formMessage");
    if(!valid){
      message.textContent = "Revisa los campos marcados.";
      return;
    }
    saveState({name,album,song});
    message.textContent = `Bienvenido al archivo, ${name}. Tu pick es ${album} + “${song}”.`;
    form.reset();
    updateSavedPreferences();
  });
}

function initStorage(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if(saved.name) $("#fanName").value = saved.name;
    if(saved.album) $("#favoriteAlbum").value = saved.album;
    if(saved.ranking){
      const map = new Map(albums.map(a=>[a.id,a]));
      const restored = saved.ranking.map(id=>map.get(id)).filter(Boolean);
      const missing = albums.filter(a=>!saved.ranking.includes(a.id));
      if(restored.length === albums.length) state.albums = restored;
    }
    if(saved.era){
      const btn = $(`.era-btn[data-era="${CSS.escape(saved.era)}"]`);
      if(btn){
        btn.classList.add("selected");
        $("#eraResult").textContent = eraMessages[saved.era];
      }
    }
    renderRanking();
    updateSavedPreferences(saved);
  }catch(error){
    console.warn("localStorage no disponible:", error);
  }

  $("#clearDataBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state.albums = [...albums];
    $$(".era-btn").forEach(b=>b.classList.remove("selected"));
    $("#eraResult").textContent = "Selecciona una era para revelar tu perfil Flacko.";
    $("#fanForm").reset();
    $("#formMessage").textContent = "";
    renderRanking();
    updateSavedPreferences({});
  });
}

function saveState(partial){
  try{
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...current,
      ...partial,
      ranking: partial.ranking || current.ranking || state.albums.map(a=>a.id)
    }));
    updateSavedPreferences();
  }catch(error){
    console.warn("No se pudo guardar la preferencia:", error);
  }
}
function updateSavedPreferences(savedArg){
  const saved = savedArg || JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const bits = [];
  if(saved.name) bits.push(`Nombre: ${saved.name}`);
  if(saved.album) bits.push(`Álbum: ${saved.album}`);
  if(saved.song) bits.push(`Canción: ${saved.song}`);
  if(saved.era) bits.push(`Era: ${saved.era.toUpperCase()}`);
  $("#savedPreferences").textContent = bits.length
    ? `Guardado en este navegador · ${bits.join(" · ")}`
    : "Tus preferencias se guardarán en este navegador.";
}

function stripHtml(value){
  const div = document.createElement("div");
  div.innerHTML = String(value);
  return div.textContent || div.innerText || "";
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}
