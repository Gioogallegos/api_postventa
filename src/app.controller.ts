import { Controller, Get } from "@nestjs/common";
// utilities
import { cascadeError } from "./shared/configs/cascade-error";
@Controller("dt")
export class LiveProbeController {
  @Get("")
  async liveProbe() {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      throw cascadeError(error, "liveProbe");
    }
  }
}
