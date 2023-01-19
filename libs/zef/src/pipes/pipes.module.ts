import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { RouteKeyPipe } from './route-key.pipe';
import { DecimalsPipe } from './decimals.pipe';
import { NameQuotingPipe } from './name-quoting.pipe';
import { NoDecimalsPipe } from './nodecimals.pipe';
import { RouterParamsPipe } from './router-params.pipe';
import { RemoveFromStringPipe } from './remove-from-string.pipe';
import { MiddleEllipsisPipe } from './middle-ellipsis.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ToNumberPipe } from './to-number.pipe';
import { SumByPipe } from './sum-by.pipe';
import { ShortNumberPipe } from './short-number.pipe';

@NgModule({
  declarations: [
    HighlightPipe,
    RouteKeyPipe,
    RouterParamsPipe,
    RemoveFromStringPipe,
    MiddleEllipsisPipe,
    DecimalsPipe,
    NameQuotingPipe,
    NoDecimalsPipe,
    SafeHtmlPipe,
    ToNumberPipe,
    SumByPipe,
    ShortNumberPipe
  ],
  exports: [
    HighlightPipe,
    RouteKeyPipe,
    MiddleEllipsisPipe,
    RouterParamsPipe,
    RemoveFromStringPipe,
    DecimalsPipe,
    NameQuotingPipe,
    NoDecimalsPipe,
    SafeHtmlPipe,
    ToNumberPipe,
    SumByPipe,
    ShortNumberPipe
  ]
})
export class ZefPipesModule {

}
