function Utils(saidaErroId) {
    let self = this;
    this.saidaErro = document.getElementById(saidaErroId);

    const URL_OPENCV = 'opencv.js';
    this.carregarOpenCv = function (callbackCarregamento) {
        let script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        script.addEventListener('load', () => {
            if (cv.getBuildInformation) {
                console.log(cv.getBuildInformation());
                callbackCarregamento();
            } else {
                cv['onRuntimeInitialized'] = () => {
                    console.log(cv.getBuildInformation());
                    callbackCarregamento();
                }
            }
        });
        script.addEventListener('error', () => {
            self.exibirErro('Falha ao carregar ' + URL_OPENCV);
        });
        script.src = URL_OPENCV;
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script, node);
    };

    this.criarArquivoAPartirDeUrl = function (caminho, url, callback) {
        let requisicao = new XMLHttpRequest();
        requisicao.open('GET', url, true);
        requisicao.responseType = 'arraybuffer';
        requisicao.onload = function (ev) {
            if (requisicao.readyState === 4) {
                if (requisicao.status === 200) {
                    let dados = new Uint8Array(requisicao.response);
                    cv.FS_createDataFile('/', caminho, dados, true, false, false);
                    callback();
                } else {
                    self.exibirErro('Falha ao carregar ' + url + ' status: ' + requisicao.status);
                }
            }
        };
        requisicao.send();
    };

    this.carregarImagemParaCanvas = function (url, idCanvas) {
        let canvas = document.getElementById(idCanvas);
        let contexto = canvas.getContext('2d');
        let imagem = new Image();
        imagem.crossOrigin = 'anonymous';
        imagem.onload = function () {
            canvas.width = imagem.width;
            canvas.height = imagem.height;
            contexto.drawImage(imagem, 0, 0, imagem.width, imagem.height);
        };
        imagem.src = url;
    };

    this.executarCodigo = function (idTextArea) {
        try {
            this.limparErro();
            let codigo = document.getElementById(idTextArea).value;
            eval(codigo);
        } catch (err) {
            this.exibirErro(err);
        }
    };

    this.limparErro = function () {
        this.saidaErro.innerHTML = '';
    };

    this.exibirErro = function (erro) {
        if (typeof erro === 'undefined') {
            erro = '';
        } else if (typeof erro === 'number') {
            if (!isNaN(erro)) {
                if (typeof cv !== 'undefined') {
                    erro = 'Exceção: ' + cv.exceptionFromPtr(erro).msg;
                }
            }
        } else if (typeof erro === 'string') {
            let ptr = Number(erro.split(' ')[0]);
            if (!isNaN(ptr)) {
                if (typeof cv !== 'undefined') {
                    erro = 'Exceção: ' + cv.exceptionFromPtr(ptr).msg;
                }
            }
        } else if (erro instanceof Error) {
            erro = erro.stack.replace(/\n/g, '<br>');
        }
        this.saidaErro.innerHTML = erro;
    };

    this.carregarCodigo = function (idScript, idTextArea) {
        let scriptNode = document.getElementById(idScript);
        let textArea = document.getElementById(idTextArea);
        if (scriptNode.type !== 'text/code-snippet') {
            throw Error('Tipo de código desconhecido');
        }
        textArea.value = scriptNode.text.replace(/^\n/, '');
    };

    this.adicionarManipuladorDeArquivo = function (idInputArquivo, idCanvas) {
        let elementoInput = document.getElementById(idInputArquivo);
        elementoInput.addEventListener('change', (e) => {
            let arquivos = e.target.files;
            if (arquivos.length > 0) {
                let urlImagem = URL.createObjectURL(arquivos[0]);
                self.carregarImagemParaCanvas(urlImagem, idCanvas);
            }
        }, false);
    };

    function noVideoPodeReproduzir() {
        if (self.callbackQuandoCameraIniciada) {
            self.callbackQuandoCameraIniciada(self.stream, self.video);
        }
    };

    this.iniciarCamera = function (resolucao, callback, idVideo) {
        const constraints = {
            'qvga': { width: { exact: 320 }, height: { exact: 240 } },
            'vga': { width: { exact: 640 }, height: { exact: 480 } }
        };
        let video = document.getElementById(idVideo);
        if (!video) {
            video = document.createElement('video');
        }

        let constraintVideo = constraints[resolucao];
        if (!constraintVideo) {
            constraintVideo = true;
        }

        navigator.mediaDevices.getUserMedia({ video: constraintVideo, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                self.video = video;
                self.stream = stream;
                self.callbackQuandoCameraIniciada = callback;
                video.addEventListener('canplay', noVideoPodeReproduzir, false);
            })
            .catch(function (err) {
                self.exibirErro('Erro na câmera: ' + err.name + ' ' + err.message);
            });
    };

    this.pararCamera = function () {
        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.video.removeEventListener('canplay', noVideoPodeReproduzir);
        }
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
        }
    };
};
