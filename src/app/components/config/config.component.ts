import { Component, OnInit } from "@angular/core";
import { Config } from "src/app/models/config.model";
import { ConfigService } from "src/app/services/config.service";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  config: Config = {
  };
  // submitted = false;

  constructor(
    private configService: ConfigService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.configService.get()
      .subscribe(
        response => {
          console.log(response);
          this.config.wbnbContract = response.wbnbContract;
          this.config.usdtContract = response.usdtContract;
          this.config.quickSwapRouter = response.quickSwapRouter;
          this.config.pancakeSwapRouter = response.pancakeSwapRouter;
          this.config.cofeeSwapRouter = response.cofeeSwapRouter;
          this.config.router = response.router;
          this.config.quickSwapFactory = response.quickSwapFactory;
          this.config.pancakeSwapFactory = response.pancakeSwapFactory;
          this.config.cofeeSwapFactory = response.cofeeSwapFactory;
          this.config.factory = response.factory;
          this.config.bscMainNetURL = response.bscMainNetURL;
        },
        error => {
          console.log(error);
        })
  }

  saveConfig(): void {
    const data = {
      wbnbContract: this.config.wbnbContract,
      usdtContract: this.config.usdtContract,
      quickSwapRouter: this.config.quickSwapRouter,
      pancakeSwapRouter: this.config.pancakeSwapRouter,
      cofeeSwapRouter: this.config.cofeeSwapRouter,
      router: this.config.router,
      quickSwapFactory: this.config.quickSwapFactory,
      pancakeSwapFactory: this.config.pancakeSwapFactory,
      cofeeSwapFactory: this.config.cofeeSwapFactory,
      factory: this.config.factory,
      bscMainNetURL: this.config.bscMainNetURL
    };

    this.configService.update(data)
      .subscribe(
        response => {
          console.log(response);
          this.showSuccess();
          // this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }


  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved correctly' });
  }

}