import i18next from "i18next";
import { InGameScene } from "../scenes/ingame-scene";
import { ModalFormUi } from "./modal-form-ui";
import { addText, addTextInput, addWindow } from "./ui-manger";
import { TEXTURE } from "../enums/texture";
import { TEXTSTYLE } from "../enums/textstyle";
import InputText from "phaser3-rex-plugins/plugins/gameobjects/dom/inputtext/InputText";
import { ModeManager } from "../mode-manager";
import { MODE } from "../enums/mode";
import { ServiceLocator } from "../utils/service-locator";
import { apiPost } from "../utils/api";

export class LoginFormUi extends ModalFormUi{
    private inputContainers:Phaser.GameObjects.Container[]=[];
    private inputs: InputText[] = [];
    private btns: Phaser.GameObjects.NineSlice[] = [];
    private modeManager: ModeManager;

    private inputConfig = [
        {
            key: i18next.t("menu:username"),
            containerY: 220,
            type: 'text',
            placeholder: i18next.t("menu:username")
        },
        {
            key: i18next.t("menu:password"),
            containerY: 264,
            type: 'password',
            placeholder: i18next.t("menu:password")
        }
    ];

    private btnConfig = [
        {
            key: i18next.t("menu:loginBtn"),
            containerX: 480,
            containerY: 320,
            bgX: 0,
            bgY: 0,
            bgWidth: 240, //240
            bgHeight: 38
        },
        {
            key: i18next.t("menu:registerBtn"),
            containerX: 478,
            containerY: 364,
            bgX: -60,
            bgY: 0,
            bgWidth: 115,
            bgHeight: 36
        },
        {
            key: i18next.t("menu:findAccountBtn"),
            containerX: 482,
            containerY: 364,
            bgX: 60,
            bgY: 0,
            bgWidth: 115,
            bgHeight: 36
        }
    ]

    constructor(scene:InGameScene){
        super(scene);
        this.modeManager = ServiceLocator.get<ModeManager>('mode-manager');
    }

    setup(): void {
        super.setup();
        const field1 = this.getField('inputs')!;
        const field2 = this.getField('btns')!;
        for (const item of field1) {
            const config = this.inputConfig.find(config => config.key === item);
            if (config) {
                const inputContainer = this.scene.add.container(480, config.containerY);
                const inputBg = addWindow(this.scene, TEXTURE.INPUT_0, 0, 0, 240, 36);
                const input = addTextInput(this.scene, 0, 0, 230, 36, TEXTSTYLE.ACCOUNT_INPUT, {
                    type: config.type,
                    fontSize: '16px',
                    placeholder: config.placeholder,
                    minLength:6,
                    maxLength:16
                });
                
                inputContainer.add(inputBg);
                inputContainer.add(input);
                inputContainer.setVisible(false);
        
                this.inputs.push(input);
                this.inputContainers.push(inputContainer);
                this.modalContainer.add(inputContainer);
            }
        }

        for (const item of field2) {
            const config = this.btnConfig.find(config => config.key === item);
            if (config) {
                const btnContainer = this.scene.add.container(config.containerX, config.containerY);
                const btnBg = addWindow(this.scene, TEXTURE.BTN_0, config.bgX, config.bgY, config.bgWidth, config.bgHeight);
                const btnText = addText(this.scene, config.bgX, 0, item, TEXTSTYLE.ACCOUNT);
                btnText.setOrigin(0.5, 0.5);

                this.btns.push(btnBg);
                btnContainer.add(btnBg);
                btnContainer.add(btnText);
                this.modalContainer.add(btnContainer);
            }
        }
    }

    show(): void {
        super.show();

        this.setBackground(TEXTURE.BG_0);

        for(const item of this.inputContainers){
            item.setVisible(true);
        }

        for(const item of this.btns){
            item.setInteractive();
        }
        
        this.btns[0].on("pointerdown",()=>{
            if(this.inputs[0].text.length===0 || this.inputs[1].text.length===0){
                this.modeManager.setMode(MODE.MESSAGE,true,i18next.t("message:loginError1"));
                return;
            }

            this.modeManager.setMode(MODE.WAITING,false);

            apiPost("/account/login",{"username":this.inputs[0].text,"password":this.inputs[1].text})
                .then((value)=>{
                    if(value.data){this.modeManager.setMode(MODE.TITLE,false,value.data);}
                    else{this.modeManager.setMode(MODE.TITLE,false,null);}
                })
                .catch((value)=>{
                    if(value.status === 401){
                        this.modeManager.setMode(MODE.LOGIN,false);
                        this.modeManager.setMode(MODE.MESSAGE,true,i18next.t("message:loginError2"));
                    }else{
                        this.modeManager.setMode(MODE.LOGIN,false);
                        this.modeManager.setMode(MODE.MESSAGE,true,i18next.t("message:serverError"));
                    }
                })
        });
        
        this.btns[1].on("pointerdown",()=>{this.modeManager.setMode(MODE.REGISTRATION,false);});
        this.btns[2].on("pointerdown",()=>{console.log('moveToFindAccount');});
    }

    blockInputs(): void {
        for (const input of this.inputs) {
            input.setBlur();
            input.pointerEvents = 'none';
        }
        for (const btn of this.btns) {
            btn.disableInteractive();
        }
    }

    unblockInputs(): void{
        for (const input of this.inputs) {
            input.pointerEvents = 'auto';
        }
        for (const btn of this.btns) {
            btn.setInteractive();
        }
    }

    clean():void{
        super.clean();

        for(const item of this.inputContainers){
            item.setVisible(false);
        }

        for(const item of this.btns){
            item.off('pointerdown')
        }
    }

    getField(type:string){
        if(type==="inputs") return [i18next.t("menu:username"),i18next.t("menu:password")];
        else if(type==="btns") return [i18next.t("menu:loginBtn"),i18next.t("menu:registerBtn"),i18next.t("menu:findAccountBtn")];
    }
}