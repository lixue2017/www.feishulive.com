import Vue from 'vue';
import Main from './main.vue';
let DanmuConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;
let switchType = true;

const Danmu = function(options) { 
  if(!switchType) {
    return
  }
  let userOnClose = options.onClose;
  let id = 'danmu_' + seed++;

  options.onClose = function() {
    Danmu.close(id, userOnClose);
  };
  let instance = new DanmuConstructor({
    data: options
  })
  instance.id = id;
  instance.$mount();
  let danmu = document.getElementById("video-container").querySelector("#gift_droadcast");
  if(!danmu) {
    let vcdplayer = document.getElementById("video-container").querySelector(".vcp-player");
    danmu = document.createElement("div");
    danmu.setAttribute("id", "gift_droadcast");
    danmu.setAttribute("class", "danmu");
    // danmu.style.zIndex = 3
    vcdplayer.appendChild(danmu);    
  }
  danmu.appendChild(instance.$el);
  instance.timer = new Date().getTime();
  instance.i = 0;
  let containerH = document.getElementById("video-container").offsetHeight;
  let containerW = document.getElementById("video-container").offsetWidth;
  let verticalOffset = options.top || 16;
  let i = [];
  instances.forEach((item,key) => {
    var t = (new Date().getTime() - item.timer)/10000
    let left = t*(containerW+item.$el.offsetWidth);
    if(left<item.$el.offsetWidth+40) {
      i.push(item.i)
    }
  });
  for (let index = 0; index < Math.floor(containerH/90); index++) {
     if(i.indexOf(index) == -1) {
      instance.i = index;
      verticalOffset = index*90+16
      break
     }      
  }
  instance.verticalOffset = verticalOffset;
  instances.push(instance)
  return instance;
};

Danmu.close = function(id, userOnClose) {
  let len = instances.length;
  let index = -1;
  let removedHeight;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};

Danmu.closeAll = function() {
  let danmu = document.getElementById("video-container").querySelector(".danmu");
  if(danmu) {
    danmu.remove();
  }  
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

Danmu.switch = function(type) {
  switchType = type;
  if(!type) {
    Danmu.closeAll()
  }
}

export default Danmu;