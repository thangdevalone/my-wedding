// === FUNCTION LT ===
lt=function(t,e,a,n){
  if(isEmptyLadiPage(i.runtime.current_element_mouse_down_gallery_view)&&isEmptyLadiPage(i.runtime.current_element_mouse_down_gallery_control)){
    var o=t.getAttribute("data-runtime-id");
    if(isEmptyLadiPage(i.runtime.timeout_gallery[o])&&(!i.runtime.tmp.gallery_playing_video||!e)){
      var r=t.getElementsByClassName("ladi-gallery-view-item"),d=t.getElementsByClassName("ladi-gallery-control-item");
      if(e&&t.getElementsByClassName("ladi-gallery-control-box")[0].style.removeProperty("transition-duration"),0!=r.length&&0!=r.length){
        var s=t.getAttribute("data-is-next")||"true";
        s="true"==s.toLowerCase();
        var l=parseFloatLadiPage(t.getAttribute("data-current"))||0,c=parseFloatLadiPage(t.getAttribute("data-max-item"))||0;
        e?l>=c-1?l=0:l++:s?++l>=c&&(l=0):--l<0&&(l=c-1),l<0&&(l=0),l>=c-1&&(l=c-1),isEmptyLadiPage(a)&&(a=s?"next":"prev"),isEmptyLadiPage(n)&&(n=s?"left":"right"),i.runtime.tmp.gallery_playing_video&&!r[l].classList.contains("selected")&&i.pauseAllVideo(),r[l].classList.add(a);
        var u=t.querySelectorAll(".ladi-gallery-view-item.selected")[0];
        isEmptyLadiPage(u)||u.classList.add(n);
        var p=1e3*(parseFloatLadiPage(getComputedStyle(r[l]).transitionDuration)||0);
        i.runtime.timeout_gallery[o]=i.runTimeout(function(){
          r[l].classList.add(n),i.runtime.timeout_gallery[o]=i.runTimeout(function(){
            for(var t=0;
            t<r.length;
            t++)t==l?r[t].classList.add("selected"):r[t].classList.remove("selected"),r[t].style.removeProperty("left"),r[t].classList.remove(a),r[t].classList.remove(n);
            delete i.runtime.timeout_gallery[o]
          }
          ,p-5)
        }
        ,5);
        for(var m=0;
        m<d.length;
        m++)(parseFloatLadiPage(d[m].getAttribute("data-index"))||0)==l?d[m].classList.add("selected"):d[m].classList.remove("selected");
        var g=i.getElementBoundingClientRect(t),_=i.getElementBoundingClientRect(t.getElementsByClassName("ladi-gallery-control-item")[l]);
        if(t.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.remove("opacity-0"),t.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.remove("opacity-0"),t.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-top")||t.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-bottom")){
          var y=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control")[0]).width)||0,f=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control-item")[l]).width)||0,h=_.x-g.x-(y-f)/2;
          h=-(h-=parseFloatLadiPage(t.getElementsByClassName("ladi-gallery-control-box")[0].style.getPropertyValue("left"))||0)>0?0:-h;
          var v=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control-box")[0]).width)||0;
          h<(v=(v=-(v-=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control")[0]).width)||0))>0?0:v)&&(h=v),t.getElementsByClassName("ladi-gallery-control-box")[0].style.setProperty("left",h+"px"),h>=0&&t.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.add("opacity-0"),h<=v&&t.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.add("opacity-0")
        }
        else{
          var P=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control")[0]).height)||0,E=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control-item")[l]).height)||0,L=_.y-g.y-(P-E)/2;
          L=-(L-=parseFloatLadiPage(t.getElementsByClassName("ladi-gallery-control-box")[0].style.getPropertyValue("top"))||0)>0?0:-L;
          var b=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control-box")[0]).height)||0;
          L<(b=(b=-(b-=parseFloatLadiPage(getComputedStyle(t.getElementsByClassName("ladi-gallery-control")[0]).height)||0))>0?0:b)&&(L=b),t.getElementsByClassName("ladi-gallery-control-box")[0].style.setProperty("top",L+"px"),L>=0&&t.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.add("opacity-0"),L<=b&&t.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.add("opacity-0")
        }
        t.setAttribute("data-is-next",s),t.setAttribute("data-current",l),c<=1?(t.getElementsByClassName("ladi-gallery-view-arrow-left")[0].classList.add("opacity-0"),t.getElementsByClassName("ladi-gallery-view-arrow-right")[0].classList.add("opacity-0")):(t.getElementsByClassName("ladi-gallery-view-arrow-left")[0].classList.remove("opacity-0"),t.getElementsByClassName("ladi-gallery-view-arrow-right")[0].classList.remove("opacity-0")),(t.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-left")||t.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-right"))&&i.reloadLazyload(!1),!e&&t.hasAttribute("data-loaded")&&t.setAttribute("data-stop",!0)
      }
      
    }
    
  }
  
}
,ct=function(t,e,a){
  var n=e.getAttribute("data-video-type"),o=e.getAttribute("data-video-url"),r=e.getAttribute("data-index"),d=t.getAttribute("data-runtime-id")+"_"+r+"_player",s=document.getElementById(d);
  a||(i.pauseAllVideo(),i.runtime.tmp.gallery_playing_video=!0),isEmptyLadiPage(s)?(n==i.const.VIDEO_TYPE.youtube&&(s=document.createElement("iframe"),e.parentElement.insertBefore(s,e.nextSibling),s.outerHTML='<iframe id="'+d+'" class="iframe-video-preload" data-video-type="'+n+'" style="position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
  " frameborder="0" allow="accelerometer;
   autoplay;
   encrypted-media;
   gyroscope;
   picture-in-picture" allowfullscreen></iframe>',i.runEventPlayVideo(d,n,o,!1,!1,!0,a,!1,!0)),n==i.const.VIDEO_TYPE.direct&&(s=document.createElement("video"),e.parentElement.insertBefore(s,e.nextSibling),s.outerHTML='<video id="'+d+'" class="iframe-video-preload" data-video-type="'+n+'" style="position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
   object-fit: cover;
  "></video>',i.runEventPlayVideo(d,n,o,!1,!1,!0,a,!1,!0))):i.runEventReplayVideo(d,n,!0)
}
,ut=function(t,e,a,n){
  if("gallery"==n&&(a||(e=document.getElementById(t)),!isEmptyLadiPage(e))){
    var o=e.getElementsByClassName("ladi-gallery-control-item").length;
    e.setAttribute("data-max-item",o),e.setAttribute("data-runtime-id",i.randomString(10));
    var r=function(t){
      t.stopPropagation(),ct(e,t.target,!1)
    }
    ,d=e.classList.contains("preload");
    if(o>0){
      for(var s=0;
      s<o;
      s++){
        var l=e.getElementsByClassName("ladi-gallery-view-item")[s];
        isEmptyLadiPage(l)||(d&&ct(e,l,d),l.classList.contains("play-video")&&l.addEventListener("click",r))
      }
      e.setAttribute("data-current",0),e.setAttribute("data-is-next",!0)
    }
    for(var c=e.getElementsByClassName("ladi-gallery-view-arrow"),u=0;
    u<c.length;
    u++)o<=1?c[u].classList.add("ladi-hidden"):c[u].classList.remove("ladi-hidden")
  }
  
}
,

// === FUNCTION PT ===
pt=function(t,e){
  t.stopPropagation();
  var a=i.runtime.eventData[e.id],n=a[i.runtime.device+".option.gallery_control.autoplay"],o=a[i.runtime.device+".option.gallery_control.autoplay_time"],r=0;
  n&&!isEmptyLadiPage(o)&&(r=o);
  var d=parseFloatLadiPage(t.target.getAttribute("data-index"))||0,s=null,l=null;
  (parseFloatLadiPage(e.getAttribute("data-current"))||0)>d?(s="prev",l="right"):(s="next",l="left");
  var c=e.getAttribute("data-is-next")||"true";
  (c="true"==c.toLowerCase())?d--:d++,e.setAttribute("data-current",d),e.setAttribute("data-next-time",Date.now()+1e3*r),lt(e,!1,s,l)
}
,mt=function(){
  D.forEach(function(t){
    var e=i.runtime.eventData[t];
    if("gallery"==e.type)for(var a=document.querySelectorAll("#"+t),n=0;
    n<a.length;
    n++){
      var o=a[n];
      if("true"==o.getAttribute("data-scrolled")&&"true"!=o.getAttribute("data-stop")){
        var r=e[i.runtime.device+".option.gallery_control.autoplay"],d=e[i.runtime.device+".option.gallery_control.autoplay_time"],s=0;
        if(r&&!isEmptyLadiPage(d)&&(s=d),s>0){
          var l=o.getAttribute("data-next-time"),c=Date.now();
          isEmptyLadiPage(l)&&(l=c+1e3*(s-1),o.setAttribute("data-next-time",l)),c>=l&&(lt(o,!0),o.setAttribute("data-next-time",c+1e3*s))
        }
        
      }
      
    }
    
  }
  )
}
,

// === FUNCTION GT ===
gt=function(t,e){
  var a=i.runtime.eventData[t];
  if("gallery"==a.type){
    var n=e.getAttribute("data-runtime-id");
    if(!e.hasAttribute("data-scrolled")){
      e.setAttribute("data-scrolled",!1);
      i.runtime.list_scroll_func[n]=function(){
        e.setAttribute("data-scrolled",!0)
      }
      
    }
    var o=a[i.runtime.device+".option.gallery_control.autoplay"],r=a[i.runtime.device+".option.gallery_control.autoplay_time"],d=0;
    o&&!isEmptyLadiPage(r)&&(d=r);
    var s=function(t){
      pt(t,e)
    }
    ,l=function(t){
      if(t.stopPropagation(),!(t=i.getEventCursorData(t)).target.classList.contains("ladi-gallery-view-arrow")){
        var a=e.getAttribute("data-runtime-id");
        isEmptyLadiPage(i.runtime.timeout_gallery[a])&&(i.runtime.current_element_mouse_down_gallery_view=a,i.runtime.current_element_mouse_down_gallery_view_position_x=t.pageX,i.runtime.current_element_mouse_down_gallery_view_position_y=t.pageY)
      }
      
    }
    ,c=function(t){
      t.stopPropagation(),t=i.getEventCursorData(t),(e.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-top")||e.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-bottom"))&&(t.target.classList.contains("ladi-gallery-control-arrow")||(i.runtime.current_element_mouse_down_gallery_control=n,i.runtime.current_element_mouse_down_gallery_control_time=Date.now(),i.runtime.current_element_mouse_down_gallery_control_position_x=t.pageX,e.getElementsByClassName("ladi-gallery-control-box")[0].style.setProperty("transition-duration","0ms"),e.getElementsByClassName("ladi-gallery-control-box")[0].setAttribute("data-left",getComputedStyle(e.getElementsByClassName("ladi-gallery-control-box")[0]).left)))
    }
    ;
    e.getElementsByClassName("ladi-gallery-view-arrow-left")[0].addEventListener("click",function(t){
      t.stopPropagation(),e.setAttribute("data-is-next",!1),e.setAttribute("data-next-time",Date.now()+1e3*d),lt(e,!1)
    }
    ),e.getElementsByClassName("ladi-gallery-view-item").length>1&&(e.getElementsByClassName("ladi-gallery-view-arrow-left")[0].classList.remove("opacity-0"),e.getElementsByClassName("ladi-gallery-view-arrow-right")[0].classList.remove("opacity-0")),e.getElementsByClassName("ladi-gallery-view-arrow-right")[0].addEventListener("click",function(t){
      t.stopPropagation(),e.setAttribute("data-is-next",!0),e.setAttribute("data-next-time",Date.now()+1e3*d),lt(e,!1)
    }
    ),e.getElementsByClassName("ladi-gallery-control-arrow-left")[0].addEventListener("click",function(t){
      t.stopPropagation();
      var i=e.getElementsByClassName("ladi-gallery-control-item")[0];
      if(!isEmptyLadiPage(i)){
        var a=getComputedStyle(i);
        if(e.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.remove("opacity-0"),e.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.remove("opacity-0"),e.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-top")||e.getElementsByClassName("ladi-gallery")[0].classList.contains("ladi-gallery-bottom")){
          var n=(parseFloatLadiPage(a.width)||0)+(parseFloatLadiPage(a.marginRight)||0);
          n+=parseFloatLadiPage(e.getElementsByClassName("ladi-gallery-control-box")[0].style.getPropertyValue("left"))||0;
          var o=parseFloatLadiPage(getComputedStyle(e.getElementsByClassName("ladi-gallery-control-box")[0]).width)||0;
          o=(o=-(o-=parseFloatLadiPage(getComputedStyle(e.getElementsByClassName("ladi-gallery-control")[0]).width)||0))>0?0:o,n>0&&(n=0),e.getElementsByClassName("ladi-gallery-control-box")[0].style.setProperty("left",n+"px"),n>=0&&e.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.add("opacity-0"),n<=o&&e.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.add("opacity-0")
        }
        else{
          var r=(parseFloatLadiPage(a.height)||0)+(parseFloatLadiPage(a.marginBottom)||0);
          r+=parseFloatLadiPage(e.getElementsByClassName("ladi-gallery-control-box")[0].style.getPropertyValue("top"))||0;
          var s=parseFloatLadiPage(getComputedStyle(e.getElementsByClassName("ladi-gallery-control-box")[0]).height)||0;
          s=(s=-(s-=parseFloatLadiPage(getComputedStyle(e.getElementsByClassName("ladi-gallery-control")[0]).height)||0))>0?0:s,r>0&&(r=0),e.getElementsByClassName("ladi-gallery-control-box")[0].style.setProperty("top",r+"px"),r>=0&&e.getElementsByClassName("ladi-gallery-control-arrow-left")[0].classList.add("opacity-0"),r<=s&&e.getElementsByClassName("ladi-gallery-control-arrow-right")[0].classList.a