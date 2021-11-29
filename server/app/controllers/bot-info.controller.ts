import { BotInfo } from '@app/database/bot-info/bot-info';
import { BotInfoService } from '@app/database/bot-info/bot-info.service';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BotInfoController {
    router: Router;

    constructor(private botInfoService: BotInfoService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req, res) => {
            try {
                const botInfos = await this.botInfoService.getBotInfoList();
                res.json(botInfos);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const clientBotInfo = req.body as BotInfo;
                const isBotExist = await this.botInfoService.isBotExist(clientBotInfo.name);
                if (isBotExist) {
                    res.send(false);
                } else {
                    clientBotInfo.canEdit = true;
                    await this.botInfoService.addBot(clientBotInfo);
                    res.send(true);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.delete('/:botName', async (req, res) => {
            try {
                const botName = req.params.botName;
                const botinfo = await this.botInfoService.getBotInfoByName(botName);
                await this.botInfoService.deleteBot(botinfo);
                res.sendStatus(StatusCodes.OK);
            } catch (error) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, res) => {
            try {
                const clientBotInfos = req.body as BotInfo[];
                const ans = await this.botInfoService.updateBot(clientBotInfos[0], clientBotInfos[1]);
                res.send(ans);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.get('/drop', async (req, res) => {
            try {
                await this.botInfoService.clearDropCollection();
                res.send(true);
            } catch (error) {
                res.send(false);
            }
        });
    }
}