var m_x = 0;
var m_y = 0;
var point = 0;

var merit_point = localStorage.getItem("merit_point");
if (merit_point !== null){
    console.log(merit_point)
    $(".point>span").html(merit_point);
}

point = merit_point;

$("body").mousemove(function(e) {
    m_x = e.pageX;
    m_y = e.pageY;
});

$("#p-1").on("click",function(){
    //console.log(m_x+","+m_y);
    let clone_text= $(".wooden-fish .Merit-text").clone(true).appendTo("body");
    point++;
    $(".point>span").html(point);
    localStorage.setItem("merit_point", point);
    broadcastSe(SE.hit);
    
    clone_text.show().css({top:(m_y-50), left: (m_x-50), position:'absolute'});
    //$(".Merit-text").css({top: m_y, left: m_x, position:'absolute'});
    setTimeout(function(){
        clone_text.addClass("Merit-text-show")
    }, 1);
    setTimeout(function(){
        clone_text.remove();
    }, 1001);


    $(".wooden-fish>img").addClass("stick-hit")
    setTimeout(function(){
        $(".wooden-fish>img").removeClass("stick-hit")
    }, 100);
});


const SE = {
    hit: {
        path: 'audio/hit.mp3',
        type: 'audio/mp3',
        duration: 900,
        volume: 0.75,
    },
}
const seList = [];

for (let i = 0; i < 20; i++) {
    const audioElement = document.createElement('audio');
    document.body.appendChild(audioElement);
    seList.push({
        dom: audioElement,
        finishTime: 0,
    });
}
const broadcastSe = (se) => {
    // 获取当前时间
    const now = new Date().getTime();
    // 判断是否需要防抖处理（同一个类型的音效、且播放时间差小于80ms）
    const sameItem = seList.find((item) => item.dom.getAttribute('src') === se.path && Math.abs(item.finishTime - now - se.duration) < 80);
    // 相同音效，就把音量加大，最大值为1，并结束函数。
    if (sameItem) {
        sameItem.dom.volume = Math.min(sameItem.dom.volume + 0.1, 1);
        return;
    }
    // 不同音效，寻找空闲的audio，要求dom的finishTime小于现在时间戳，说明它是空闲的
    const potentialDom = seList.find((item) => item.finishTime < now);
    if (potentialDom) {
        potentialDom.dom.setAttribute('src', se.path);
        potentialDom.dom.setAttribute('type', se.type);
        potentialDom.dom.volume = se.volume;
        potentialDom.finishTime = now + se.duration;
        // 这里要等src设置完毕后，加载好音效后再播放。所以注册了一个延迟执行的任务。否则，会播放旧的src资源
        setTimeout(() => potentialDom.dom.play(), 0);
    } else {
        console.log('资源不足，无法播放', se.path);
    }
};


var page1 = document.querySelector('#p-1');
var page2 = document.querySelector('#p-2');
var mc1 = new Hammer(page1);
var mc2 = new Hammer(page2);
var distance_of_long = 120;

// 啟用多點觸控
mc1.get('swipe').set({ direction: Hammer.DIRECTION_ALL, pointers: 1 });

mc1.on("panleft", function(ev) {
    var distance = ev.distance;
    if(distance >distance_of_long){
        $("#p-2").removeClass('out-page');
        $("#p-1").removeClass('in-page');
        if (ev.pointers.length === 1) {
            $("#p-1").addClass('out-page');
            $("#p-2").addClass('in-page');
        }
    }
});

// 啟用多點觸控
mc2.get('swipe').set({ direction: Hammer.DIRECTION_ALL, pointers: 1 });

mc2.on("panright", function(ev) {
    var distance = ev.distance;
    if(distance >distance_of_long) {
        $("#p-1").removeClass('out-page');
        $("#p-2").removeClass('in-page');
    }
});

$("#p-2 .reset-bnt").on('click',function(){
    $("#p-1").removeClass('out-page');
    $("#p-2").removeClass('in-page');

    $("#p-1 .point span").text("0");
    localStorage.setItem("merit_point", 0);
});

