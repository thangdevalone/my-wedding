"use client";

import { useMotionScroll } from "../hooks/useMotionScroll";
import { useWeddingInteractions } from "../hooks/useWeddingInteractions";

export default function WeddingContent({ guestName = "" }: { guestName?: string }) {
  // Long names get a slightly smaller script font so they stay on one line
  const guestFontSize = guestName.length > 13 ? Math.max(15, Math.floor((23 * 13) / guestName.length)) : undefined;

  useMotionScroll();
  useWeddingInteractions();

  return (
    <>
      <div className="w-wraper" suppressHydrationWarning>
        <div id="SECTION1" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE70" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="BOX17" className="w-element">
              <div className="w-box w-transition"></div>
            </div>

            <div id="HEADLINE106" className="w-element">
              <h3 className="w-headline">WE'RE GETTING MARRIED&nbsp;</h3>{" "}
            </div>
            <div id="IMAGE86" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE128" className="w-element w-animation-hidden">
              <h1 className="w-headline">Quang Thắng &amp; Tường Lan</h1>{" "}
            </div>
            <div id="HEADLINE134" className="w-element w-animation-hidden">
              <h3 className="w-headline">
                SAVE
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE135" className="w-element w-animation-hidden">
              <h3 className="w-headline">DATE</h3>{" "}
            </div>
            <div id="HEADLINE136" className="w-element w-animation-hidden">
              <h3 className="w-headline">
                the
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE137" className="w-element w-animation-hidden">
              <h3 className="w-headline">Quang Thắng &amp; Tường Lan</h3>{" "}
            </div>
          </div>
        </div>
        <div id="SECTION10" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE100" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE77" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE78" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE79" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE108" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">28</h3>{" "}
            </div>
            <div id="HEADLINE116" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                Cùng nhau bước vào chương mới, tay trong tay,
                <br />
                sẵn sàng vun đắp tổ ấm và trọn đời yêu thương.
              </h3>{" "}
            </div>
            <div id="HEADLINE102" className="w-element">
              <h3 className="w-headline">28 . 11 . 2026</h3>{" "}
            </div>
            <div id="HEADLINE138" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">11</h3>{" "}
            </div>
            <div id="HEADLINE139" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">26</h3>{" "}
            </div>
            <div id="GROUP76" className="w-element">
              <div className="w-group">
                <div id="IMAGE118" className="w-element">
                  <div className="w-image">
                    <div className="w-image-background"></div>
                  </div>
                </div>
                <div id="HEADLINE142" className="w-element w-animation-hidden">
                  <h3 className="w-headline">
                    t<br />
                  </h3>{" "}
                </div>
                <div id="HEADLINE143" className="w-element w-animation-hidden">
                  <h3 className="w-headline">
                    l<br />
                  </h3>{" "}
                </div>
              </div>
            </div>
            <div id="HEADLINE3" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">Tháng 11</h3>{" "}
            </div>
            <div id="GROUP70" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="SHAPE1" className="w-element w-animation-hidden">
                  <div className="w-shape">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="none"
                      viewBox="0 0 1792 1896.0833"
                      className=""
                      fill="rgb(127, 6, 6)"
                    >
                      {" "}
                      <path d="M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26T145 952.5 77 855 23.5 734 0 596q0-220 127-344t351-124q62 0 126.5 21.5t120 58T820 276t76 68q36-36 76-68t95.5-68.5 120-58T1314 128q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z"></path>{" "}
                    </svg>
                  </div>
                </div>
                <div id="HEADLINE4" className="w-element">
                  <h3 className="w-headline">T2</h3>{" "}
                </div>
                <div id="HEADLINE5" className="w-element">
                  <h3 className="w-headline">T3</h3>{" "}
                </div>
                <div id="HEADLINE6" className="w-element">
                  <h3 className="w-headline">T4</h3>{" "}
                </div>
                <div id="HEADLINE7" className="w-element">
                  <h3 className="w-headline">T5</h3>{" "}
                </div>
                <div id="HEADLINE8" className="w-element">
                  <h3 className="w-headline">T6</h3>{" "}
                </div>
                <div id="HEADLINE9" className="w-element">
                  <h3 className="w-headline">T7</h3>{" "}
                </div>
                <div id="HEADLINE10" className="w-element">
                  <h3 className="w-headline">CN</h3>{" "}
                </div>
                <div id="HEADLINE11" className="w-element">
                  <h3 className="w-headline">1</h3>{" "}
                </div>
                <div id="HEADLINE12" className="w-element">
                  <h3 className="w-headline">2</h3>{" "}
                </div>
                <div id="HEADLINE13" className="w-element">
                  <h3 className="w-headline">3</h3>{" "}
                </div>
                <div id="HEADLINE14" className="w-element">
                  <h3 className="w-headline">4</h3>{" "}
                </div>
                <div id="HEADLINE15" className="w-element">
                  <h3 className="w-headline">5</h3>{" "}
                </div>
                <div id="HEADLINE16" className="w-element">
                  <h3 className="w-headline">6</h3>{" "}
                </div>
                <div id="HEADLINE17" className="w-element">
                  <h3 className="w-headline">7</h3>{" "}
                </div>
                <div id="HEADLINE18" className="w-element">
                  <h3 className="w-headline">8</h3>{" "}
                </div>
                <div id="HEADLINE19" className="w-element">
                  <h3 className="w-headline">9</h3>{" "}
                </div>
                <div id="HEADLINE20" className="w-element">
                  <h3 className="w-headline">10</h3>{" "}
                </div>
                <div id="HEADLINE21" className="w-element">
                  <h3 className="w-headline">11</h3>{" "}
                </div>
                <div id="HEADLINE22" className="w-element">
                  <h3 className="w-headline">12</h3>{" "}
                </div>
                <div id="HEADLINE23" className="w-element">
                  <h3 className="w-headline">13</h3>{" "}
                </div>
                <div id="HEADLINE24" className="w-element">
                  <h3 className="w-headline">14</h3>{" "}
                </div>
                <div id="HEADLINE25" className="w-element">
                  <h3 className="w-headline">15</h3>{" "}
                </div>
                <div id="HEADLINE26" className="w-element">
                  <h3 className="w-headline">16</h3>{" "}
                </div>
                <div id="HEADLINE27" className="w-element">
                  <h3 className="w-headline">17</h3>{" "}
                </div>
                <div id="HEADLINE28" className="w-element">
                  <h3 className="w-headline">18</h3>{" "}
                </div>
                <div id="HEADLINE29" className="w-element">
                  <h3 className="w-headline">19</h3>{" "}
                </div>
                <div id="HEADLINE30" className="w-element">
                  <h3 className="w-headline">20</h3>{" "}
                </div>
                <div id="HEADLINE31" className="w-element">
                  <h3 className="w-headline">21</h3>{" "}
                </div>
                <div id="HEADLINE32" className="w-element">
                  <h3 className="w-headline">22</h3>{" "}
                </div>
                <div id="HEADLINE33" className="w-element">
                  <h3 className="w-headline">24</h3>{" "}
                </div>
                <div id="HEADLINE34" className="w-element">
                  <h3 className="w-headline">25</h3>{" "}
                </div>
                <div id="HEADLINE35" className="w-element">
                  <h3 className="w-headline">23</h3>{" "}
                </div>
                <div id="HEADLINE36" className="w-element">
                  <h3 className="w-headline">26</h3>{" "}
                </div>
                <div id="HEADLINE37" className="w-element">
                  <h3 className="w-headline">27</h3>{" "}
                </div>
                <div id="HEADLINE38" className="w-element">
                  <h3 className="w-headline">28</h3>{" "}
                </div>
                <div id="HEADLINE39" className="w-element">
                  <h3 className="w-headline">29</h3>{" "}
                </div>
                <div id="HEADLINE40" className="w-element">
                  <h3 className="w-headline">30</h3>{" "}
                </div>
                <div id="HEADLINE41" className="w-element">
                  <h3 className="w-headline">31</h3>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION2" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE48" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE92" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE116" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE112" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">TƯỜNG LAN</h3>{" "}
            </div>
            <div id="HEADLINE111" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">QUANG THẮNG</h3>{" "}
            </div>
            <div id="IMAGE119" className="w-element w-animation-hidden">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE113" className="w-element">
              <h3 className="w-headline w-transition">&amp;</h3>{" "}
            </div>
            <div id="HEADLINE67" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                trân trọng kính mời&nbsp;
                <br />
              </h3>{" "}
            </div>
            <div data-action="true" id="GROUP75" className="w-element">
              <div className="w-group">
                <div id="GROUP18" className="w-element w-animation-hidden">
                  <div className="w-group">
                    <div id="GROUP19" className="w-element w-animation-hidden">
                      <div className="w-group">
                        <div
                          id="HEADLINE59"
                          className="w-element w-animation-hidden"
                        >
                          <h3 className="w-headline w-transition">28</h3>{" "}
                        </div>
                        <div
                          id="GROUP20"
                          className="w-element w-animation-hidden"
                        >
                          <div className="w-group">
                            <div id="LINE6" className="w-element">
                              <div className="w-line">
                                <div className="w-line-container"></div>
                              </div>
                            </div>
                            <div id="HEADLINE60" className="w-element">
                              <h3 className="w-headline">THÁNG 11</h3>{" "}
                            </div>
                            <div id="LINE7" className="w-element">
                              <div className="w-line">
                                <div className="w-line-container"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="GROUP21"
                          className="w-element w-animation-hidden"
                        >
                          <div className="w-group">
                            <div id="LINE8" className="w-element">
                              <div className="w-line">
                                <div className="w-line-container"></div>
                              </div>
                            </div>
                            <div id="HEADLINE61" className="w-element">
                              <h3 className="w-headline">NĂM 2026</h3>{" "}
                            </div>
                            <div id="LINE9" className="w-element">
                              <div className="w-line">
                                <div className="w-line-container"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="HEADLINE62"
                          className="w-element w-animation-hidden"
                        >
                          <h3 className="w-headline w-transition">
                            (Tức ngày 20 tháng 10 năm Bính Ngọ)
                          </h3>{" "}
                        </div>
                      </div>
                    </div>
                    <div
                      id="HEADLINE63"
                      className="w-element w-animation-hidden"
                    >
                      <h3 className="w-headline w-transition">
                        16:00, thứ bảy
                      </h3>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="LINE11" className="w-element w-animation-hidden">
              <div className="w-line">
                <div className="w-line-container"></div>
              </div>
            </div>
            <div id="LINE12" className="w-element w-animation-hidden">
              <div className="w-line">
                <div className="w-line-container"></div>
              </div>
            </div>
            <div id="GROUP49" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="HEADLINE78" className="w-element">
                  <h3 className="w-headline">nhà gái</h3>{" "}
                </div>
                <div id="HEADLINE79" className="w-element">
                  <h3 className="w-headline">
                    Ông. Nguyễn Văn Dũng
                    <br />
                    Bà. Ninh Thị Hưng
                    <br />
                  </h3>{" "}
                </div>
                <div id="ADDR_GIRL" className="w-element">
                  <h3 className="w-headline">
                    ĐC: Cầu Trại, Ngọc Thiện
                    <br />
                    Bắc Ninh
                  </h3>{" "}
                </div>
                <a
                  href="https://maps.app.goo.gl/trtzHUiRQuXeZnco9"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="MAP_GIRL"
                  className="w-element w-animation-hidden"
                >
                  <div className="map-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1049.8953 1896.0833"
                      preserveAspectRatio="none"
                      width="14"
                      height="24"
                      fill="rgb(127, 6, 6)"
                    >
                      <path d="M768 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52L33 819Q0 749 0 640q0-212 150-362t362-150 362 150 150 362z"></path>
                    </svg>
                    <span>Xem chỉ đường</span>
                  </div>
                </a>
              </div>
            </div>
            <div id="GROUP47" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="HEADLINE76" className="w-element">
                  <h3 className="w-headline">nhà trai</h3>{" "}
                </div>
                <div id="HEADLINE77" className="w-element">
                  <h3 className="w-headline">
                    Ông. Nguyễn Quang Vinh
                    <br />
                    Bà. Dương Thị Dần
                    <br />
                  </h3>{" "}
                </div>
                <div id="ADDR_BOY" className="w-element">
                  <h3 className="w-headline">
                    ĐC: Đình tế, Ngọc Thiện
                    <br />
                    Bắc Ninh
                  </h3>{" "}
                </div>
                <a
                  href="https://maps.app.goo.gl/H8X4ybCiotQmuD727"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="MAP_BOY"
                  className="w-element w-animation-hidden"
                >
                  <div className="map-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1049.8953 1896.0833"
                      preserveAspectRatio="none"
                      width="14"
                      height="24"
                      fill="rgb(127, 6, 6)"
                    >
                      <path d="M768 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52L33 819Q0 749 0 640q0-212 150-362t362-150 362 150 150 362z"></path>
                    </svg>
                    <span>Xem chỉ đường</span>
                  </div>
                </a>
              </div>
            </div>
            <div id="HEADLINE115" className="w-element">
              <h1 className="w-headline">Quang Thắng &amp; Tường Lan</h1>{" "}
            </div>
            <div id="IMAGE109" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE140" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                tham dự buổi tiệc cưới cùng
                <br />
                gia đình chúng tôi
                <br />
              </h3>{" "}
            </div>
            <div id="LINE13" className="w-element">
              <div className="w-line">
                <div className="w-line-container"></div>
              </div>
            </div>
            <div id="HEADLINE141" className="w-element w-animation-hidden">
              <h3
                className="w-headline w-transition"
                style={guestFontSize ? { fontSize: guestFontSize, whiteSpace: "nowrap" } : { whiteSpace: "nowrap" }}
              >
                {guestName || "Quý khách"}
              </h3>{" "}
            </div>
          </div>
        </div>
        <div id="SECTION3" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="HEADLINE117" className="w-element w-animation-hidden">
              <h1 className="w-headline w-transition">
                Together, we grew in love and understanding.
              </h1>{" "}
            </div>
            <div id="GROUP77" className="w-element">
              <div className="w-group">
                <div id="IMAGE80" className="w-element">
                  <div className="w-image">
                    <div className="w-image-background"></div>
                  </div>
                </div>
                <div id="HEADLINE132" className="w-element w-animation-hidden">
                  <h3 className="w-headline w-transition">
                    Two hearts, one love, <br />
                    one beautiful journey
                    <br />
                  </h3>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION4" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE52" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE94" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE53" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="GROUP27" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="HEADLINE70" className="w-element w-animation-hidden">
                  <h3 className="w-headline">with you</h3>{" "}
                </div>
                <div id="HEADLINE71" className="w-element w-animation-hidden">
                  <h3 className="w-headline">AlloVeR</h3>{" "}
                </div>
                <div id="HEADLINE72" className="w-element w-animation-hidden">
                  <h3 className="w-headline">agaiN</h3>{" "}
                </div>
                <div id="HEADLINE73" className="w-element w-animation-hidden">
                  <h3 className="w-headline">with love</h3>{" "}
                </div>
              </div>
            </div>
            <div id="HEADLINE80" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">Timeline</h3>{" "}
            </div>
            <div id="HEADLINE81" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                <span style={{ fontWeight: "bold" }}>14:00</span>
                <br />
                rước dâu
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE82" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                <span style={{ fontWeight: "bold" }}>17:00</span>
                <br />
                lễ thành hôn
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE83" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                <span style={{ fontWeight: "bold" }}>
                  17:30
                  <br />
                </span>
                khai tiệc
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE84" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                <span style={{ fontWeight: "bold" }}>19:00</span>
                <br />
                âm nhạc
                <br />
              </h3>{" "}
            </div>
            <div id="IMAGE88" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE89" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE90" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE91" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="GROUP71" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="IMAGE85" className="w-element">
                  <div className="w-image">
                    <div className="w-image-background"></div>
                  </div>
                </div>
                <div id="BOX12" className="w-element">
                  <div className="w-box w-transition"></div>
                </div>
                <div id="BOX13" className="w-element">
                  <div className="w-box w-transition"></div>
                </div>
                <div id="BOX14" className="w-element">
                  <div className="w-box w-transition"></div>
                </div>
                <div id="BOX15" className="w-element">
                  <div className="w-box w-transition"></div>
                </div>
              </div>
            </div>
            <div id="IMAGE111" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE114" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION5" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE81" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE117" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="BOX8" className="w-element">
              <div className="w-box w-transition"></div>
            </div>
            <div id="HEADLINE86" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">Countdown</h3>{" "}
            </div>
            <div id="GROUP74" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="HEADLINE87" className="w-element">
                  <h3 className="w-headline">Ngày</h3>{" "}
                </div>
                <div id="HEADLINE88" className="w-element">
                  <h3 className="w-headline">Giờ</h3>{" "}
                </div>
                <div id="HEADLINE89" className="w-element">
                  <h3 className="w-headline">Phút</h3>{" "}
                </div>
                <div id="HEADLINE90" className="w-element">
                  <h3 className="w-headline">Giây</h3>{" "}
                </div>
                <div id="COUNTDOWN1" className="w-element">
                  <div className="w-countdown">
                    <div id="COUNTDOWN_ITEM1" className="w-element">
                      <div className="w-countdown-background"></div>
                      <div className="w-countdown-text">
                        <span>00</span>
                      </div>
                    </div>
                    <div id="COUNTDOWN_ITEM2" className="w-element">
                      <div className="w-countdown-background"></div>
                      <div className="w-countdown-text">
                        <span>00</span>
                      </div>
                    </div>
                    <div id="COUNTDOWN_ITEM3" className="w-element">
                      <div className="w-countdown-background"></div>
                      <div className="w-countdown-text">
                        <span>00</span>
                      </div>
                    </div>
                    <div id="COUNTDOWN_ITEM4" className="w-element">
                      <div className="w-countdown-background"></div>
                      <div className="w-countdown-text">
                        <span>00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="HEADLINE91" className="w-element">
                  <h3 className="w-headline">:</h3>{" "}
                </div>
                <div id="HEADLINE92" className="w-element">
                  <h3 className="w-headline">:</h3>{" "}
                </div>
                <div id="HEADLINE93" className="w-element">
                  <h3 className="w-headline">:</h3>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION6" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE54" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE82" className="w-element w-animation-hidden">
              <div className="w-image w-transition">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE83" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE74" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE76" className="w-element w-animation-hidden">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="BOX10" className="w-element">
              <div className="w-box w-transition"></div>
            </div>
            <div id="GROUP59" className="w-element w-animation-hidden">
              <div className="w-group">
                <div id="HEADLINE119" className="w-element w-animation-hidden">
                  <h3 className="w-headline w-transition">OUR</h3>{" "}
                </div>
                <div id="HEADLINE120" className="w-element w-animation-hidden">
                  <h3 className="w-headline w-transition">Moments</h3>{" "}
                </div>
              </div>
            </div>
            <div id="HEADLINE121" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">
                A collection of memories we've shared together
              </h3>{" "}
            </div>
            <div id="HEADLINE122" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">Forever</h3>{" "}
            </div>
            <div id="HEADLINE123" className="w-element w-animation-hidden">
              <h3 className="w-headline w-transition">Love you</h3>{" "}
            </div>
            <div id="IMAGE115" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION7" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="GALLERY1" className="w-element">
              <div className="w-gallery w-gallery-bottom">
                <div className="w-gallery-view">
                  <div className="w-gallery-view-arrow w-gallery-view-arrow-left"></div>
                  <div className="w-gallery-view-arrow w-gallery-view-arrow-right"></div>
                  <div
                    className="w-gallery-view-item selected"
                    data-index="0"
                  ></div>
                  <div className="w-gallery-view-item" data-index="1"></div>
                  <div className="w-gallery-view-item" data-index="2"></div>
                  <div className="w-gallery-view-item" data-index="3"></div>
                  <div className="w-gallery-view-item" data-index="4"></div>
                  <div className="w-gallery-view-item" data-index="5"></div>
                  <div className="w-gallery-view-item" data-index="6"></div>
                  <div className="w-gallery-view-item" data-index="7"></div>
                  <div className="w-gallery-view-item" data-index="8"></div>
                  <div className="w-gallery-view-item" data-index="9"></div>
                </div>
                <div className="w-gallery-control">
                  <div className="w-gallery-control-box">
                    <div
                      className="w-gallery-control-item selected"
                      data-index="0"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="1"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="2"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="3"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="4"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="5"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="6"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="7"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="8"
                    ></div>
                    <div
                      className="w-gallery-control-item"
                      data-index="9"
                    ></div>
                  </div>
                  <div className="w-gallery-control-arrow w-gallery-control-arrow-left"></div>
                  <div className="w-gallery-control-arrow w-gallery-control-arrow-right"></div>
                </div>
              </div>
            </div>
            <div id="HEADLINE97" className="w-element w-animation-hidden">
              <h3 className="w-headline">CAptuRed With Love</h3>{" "}
            </div>
            <div id="PARAGRAPH1" className="w-element w-animation-hidden">
              <div className="w-paragraph w-transition">OuR&nbsp; AlbuM</div>
            </div>
          </div>
        </div>
        <div id="SECTION8" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="IMAGE59" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="GROUP44" className="w-element">
              <div className="w-group">
                <div id="HEADLINE94" className="w-element w-animation-hidden">
                  <h3 className="w-headline w-transition">
                    Vui lòng xác nhận sự tham dự của bạn để chúng mình <br />
                    chuẩn bị đón tiếp một cách chu đáo nhất.
                    <br />
                    Trân trọng cảm ơn!
                    <br />
                  </h3>{" "}
                </div>
                <div
                  id="FORM2"
                  data-config-id="6a1c47b43c9c2f0038773866"
                  className="w-element w-animation-hidden"
                >
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    autoComplete="off"
                    method="post"
                    className="w-form"
                  >
                    <div id="BUTTON2" className="w-element">
                      <div className="w-button">
                        <div className="w-button-background"></div>
                        <div
                          id="BUTTON_TEXT2"
                          className="w-element w-button-headline"
                        >
                          <p className="w-headline">XÁC NHẬN</p>{" "}
                        </div>
                      </div>
                    </div>
                    <div id="FORM_ITEM2" className="w-element">
                      <div className="w-form-item-container">
                        <div className="w-form-item-background"></div>
                        <div className="w-form-item">
                          <input
                            autoComplete="off"
                            tabIndex={1}
                            name="name"
                            required
                            className="w-form-control"
                            type="text"
                            placeholder="Tên của bạn"
                            defaultValue={guestName}
                          />
                        </div>
                      </div>
                    </div>
                    <div id="FORM_ITEM4" className="w-element">
                      <div className="w-form-item-container">
                        <div className="w-form-item-background"></div>
                        <div className="w-form-item">
                          <select
                            tabIndex={3}
                            name="form_item8"
                            className="w-form-control w-form-control-select"
                            data-selected=""
                          >
                            <option value="">Xác nhận tham dự?</option>
                            <option value="Tôi sẽ tham dự">
                              Tôi sẽ tham dự
                            </option>
                            <option value="Xin lỗi, tôi không thể tham dự">
                              Xin lỗi, tôi không thể tham dự
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div id="FORM_ITEM5" className="w-element">
                      <div className="w-form-item-container">
                        <div className="w-form-item-background"></div>
                        <div className="w-form-item">
                          <input
                            autoComplete="off"
                            tabIndex={4}
                            name="form_item9"
                            className="w-form-control"
                            type="text"
                            placeholder="Bạn có tham dự cùng ai khác không?"
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <div id="FORM_ITEM6" className="w-element">
                      <div className="w-form-item-container">
                        <div className="w-form-item-background"></div>
                        <div className="w-form-item">
                          <select
                            tabIndex={5}
                            name="form_item10"
                            className="w-form-control w-form-control-select"
                            data-selected=""
                          >
                            <option value="">Bạn là khách mời của ai?</option>
                            <option value="Khách mời cô dâu">
                              Khách mời cô dâu
                            </option>
                            <option value="Khách mời chú rể">
                              Khách mời chú rể
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div id="FORM_ITEM3" className="w-element">
                      <div className="w-form-item-container">
                        <div className="w-form-item-background"></div>
                        <div className="w-form-item">
                          <textarea
                            tabIndex={6}
                            name="message"
                            maxLength={500}
                            className="w-form-control"
                            placeholder="Gửi lời chúc đến cô dâu chú rể..."
                            defaultValue=""
                          />
                        </div>
                      </div>
                    </div>
                    <input type="hidden" name="invite" value={guestName} />
                    {/* honeypot: hidden from people, bots fill it */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                    />
                    <button type="submit" className="w-hidden"></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="SECTION9" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="GROUP51" className="w-element">
              <div className="w-group">
                <div id="HEADLINE99" className="w-element">
                  <h3 className="w-headline">
                    nắng Wedding Invitation
                    <br />
                  </h3>{" "}
                </div>
                <div id="SHAPE4" className="w-element">
                  <div className="w-shape">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="none"
                      viewBox="0 0 32 32"
                      className=""
                      fill="rgb(248, 243, 237)"
                    >
                      <image
                        href="/icons/tiktok-icon.svg"
                        height="32"
                        width="32"
                      ></image>
                    </svg>
                  </div>
                </div>
                <div id="SHAPE5" className="w-element">
                  <div className="w-shape">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="none"
                      viewBox="0 0 32 32"
                      className=""
                      fill="rgb(248, 243, 237)"
                    >
                      <image
                        href="/icons/facebook.svg"
                        height="32"
                        width="32"
                      ></image>
                    </svg>
                  </div>
                </div>
                <div id="SHAPE6" className="w-element">
                  <div className="w-shape">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      preserveAspectRatio="none"
                      viewBox="0 0 32 32"
                      className=""
                      fill="rgb(248, 243, 237)"
                    >
                      <image
                        href="/icons/instagram.svg"
                        height="32"
                        width="32"
                      ></image>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div id="IMAGE65" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="IMAGE84" className="w-element">
              <div className="w-image">
                <div className="w-image-background"></div>
              </div>
            </div>
            <div id="HEADLINE129" className="w-element w-animation-hidden">
              <h3 className="w-headline">
                Hẹn gặp bạn trong ngày đặc biệt nhất của chúng mình.
                <br />
                Sẽ thật hạnh phúc khi có bạn ở đó, cùng sẻ chia niềm vui và
                chứng kiến khoảnh khắc ý nghĩa này của chúng mình.
                <br />
              </h3>{" "}
            </div>
            <div id="HEADLINE130" className="w-element w-animation-hidden">
              <h3 className="w-headline">
                Thank you!
                <br />
              </h3>{" "}
            </div>
          </div>
        </div>
        <div id="SECTION_POPUP" className="w-section">
          <div className="w-section-background"></div>
          <div className="w-container">
            <div id="POPUP1" className="w-element">
              <div className="w-popup">
                <div className="w-popup-background"></div>
                <div id="IMAGE69" className="w-element">
                  <div className="w-image">
                    <div className="w-image-background"></div>
                  </div>
                </div>
                <div id="HEADLINE100" className="w-element">
                  <h3 className="w-headline">
                    Cảm ơn bạn đã dành thời gian phản hồi!
                    <br />
                    Chúng mình vô cùng trân quý sự quan tâm của bạn
                    <br />
                  </h3>{" "}
                </div>
                <div id="HEADLINE101" className="w-element">
                  <h3 className="w-headline">
                    Thank you!
                    <br />
                  </h3>{" "}
                </div>
                <button type="button" className="popup-back">Quay lại</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
