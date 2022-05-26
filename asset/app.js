document.addEventListener("DOMContentLoaded", function() {
    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);

    var sofaTExture = $(".sofa_texture");
    const textureBox = $('.textureBox');
    const addModelBox = $('.addModelBox');

    const app = {
        html([first, ...string], ...values) {
            return values
                .reduce((acc, cur) => acc.concat(cur, string.shift()), [first])
                .filter((x) => (x && x !== true) || x === 0)
                .join("");
        },

        textureList: JSON.parse(localStorage.getItem(TEXTURE_SOFA_KEY) || "[]"),
        modelsAdd: JSON.parse(localStorage.getItem(MODELS_ADD_KEY) || "[]"),


        renderTextureBox() {
            textureBox.innerHTML = app.html`
                ${app.textureList.map((sofaTexture, index) => {
                    return app.html`
                        <div class="sofa_texture p-3">
                            <div class="sofa_texture_img" style="background: url('${sofaTexture.texture}') no-repeat center center / cover">
                            </div>
                            
                        </div>
                    `
                })}`
        },

        renderAddModelsBox() {
            addModelBox.innerHTML = app.html`
                ${app.modelsAdd.map((model, index) => {
                    return app.html`
                        <div class="sofa_texture p-3">
                            <div class="sofa_texture_img" style="background: url('${model.img}') no-repeat center center / cover">
                            </div>
                            
                        </div>
                    `
                })}`
        },

        handleEvents: function() {
            const _this = this;
            var listSofaTexture = $$('.sofa_texture');

            listSofaTexture.forEach((item, index) => {
                item.onclick = () => {
                    
                    console.log(this.textureList[index]);
                }
            });
        },

        render: function() {
            this.renderTextureBox();

            this.renderAddModelsBox();
        },

        start: function() {
            
            // Render playlist
            this.render();

            // Handle event 
            this.handleEvents();
            
        },
    };

    app.start();
});


