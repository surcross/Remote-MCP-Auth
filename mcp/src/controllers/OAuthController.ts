import { Request, Response } from 'express';

interface Options {
  oauthApiBaseUrl: string;
}

export class OAuthController {
  private readonly oauthApiBaseUrl: string;

  private oauthWellKnown = null;

  constructor({ oauthApiBaseUrl }: Options) {
    this.oauthApiBaseUrl = oauthApiBaseUrl;

    this.getWellKnown = this.getWellKnown.bind(this);
  }

  public async getWellKnown(req: Request, res: Response): Promise<void> {
    let wellKnown;
    try {
      wellKnown = await this.fetchOAuthWellKnown();
    } catch (error) {
      console.error('Failed to fetch OAuth well known', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send(wellKnown);
  }

  private async fetchOAuthWellKnown() {
    if (this.oauthWellKnown) {
      return this.oauthWellKnown;
    }

    const url = `${this.oauthApiBaseUrl}/.well-known/oauth-authorization-server`;

    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.error(`Failed to fetch "${url}"`, error);
      throw new Error(`Failed to fetch "${url}"`);
    }

    if (!response.ok) {
      throw new Error(`Unsuccessful response from "${url}"`);
    }

    this.oauthWellKnown = await response.json();

    return this.oauthWellKnown;
  }
}
