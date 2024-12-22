import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PassportModule } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Module({
    imports: [
        PassportModule, 
        JwtModule.register({
          secret: '11535%54$fhdgf@hds',
          signOptions: { expiresIn: '1h' }, 
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtStrategy, JwtModule], 
})
  
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: '11535%54$fhdgf@hds',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

