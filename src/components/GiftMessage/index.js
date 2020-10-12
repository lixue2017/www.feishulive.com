import Vue from 'vue';
import Main from './main.vue';
import merge from 'element-ui/src/utils/merge';
const ChatGiftConstructor = Vue.extend(Main);

let instance;
let instances = [];
let waitInstance = [];
let seed = 1;

const ChatGift = function(options) {
  if (Vue.prototype.$isServer) return;
  options.giftNum = options.giftNum?options.giftNum:1
  if(instances.length>=4) {
    var waitInstancei = waitInstance.filter(item => item.userId === options.userId && item.giftId === options.giftId)
    if(waitInstancei.length==1) {
      waitInstancei[0].giftNum += options.giftNum
      return
    }
    waitInstance.push(options)
    return
  }
  options = merge({}, options);
  const id = options.userId?'chatGift_' + options.userId+'_'+options.giftId : 'chatGift_' + seed++;
  if(instances.filter(item => item.id === id).length==1) {
    instances.filter(item => item.id === id)[0].giftNum += options.giftNum
    return
  }
  const userOnClose = options.onClose;
  const position = options.position || 'top-right';

  options.onClose = function() {
    ChatGift.close(id, userOnClose);
  };

  instance = new ChatGiftConstructor({
    data: options
  });

  instance.id = id;
  instance.$mount();
  var chatroom = document.body.querySelector(".chatroom")
  chatroom.appendChild(instance.$el);
  instance.visible = true;
  instance.dom = instance.$el;
  instance.dom.style.zIndex = 1;
  instance.giftNum = options.giftNum;
  let verticalOffset = options.offset || 0;
  instances.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  verticalOffset += 16;
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
  return instance;
};

ChatGift.close = function(id, userOnClose) {
  let index = -1;
  const len = instances.length;
  const instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i;
      return true;
    }
    return false;
  })[0];
  if (!instance) return;

  if (typeof userOnClose === 'function') {
    userOnClose(instance);
  }
  instances[index].dom.style = instances[index].dom.style.cssText+"transform: translateX(107%);transition: opacity 2s, transform 1s, -webkit-transform 1s;"
  instances.splice(index, 1);
  if(waitInstance.length>0) {
    ChatGift(waitInstance[0])
    waitInstance.splice(0, 1)
  }
  if (len <= 1) return;
  const position = instance.position;
  const removedHeight = instance.dom.offsetHeight;
  for (let i = index; i < len - 1 ; i++) {
    if (instances[i].position === position) {
      instances[i].dom.style[instance.verticalProperty] =
        parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
    }
  }
};

ChatGift.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export default ChatGift;