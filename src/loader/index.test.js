import path from 'path';
import config from 'config';
import chai from 'chai';

import loadServiceDeclarations from './index.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const SERVICE_DECLARATIONS_PATH = path.resolve(__dirname, '../..', config.get('serviceDeclarationsPath'));

const expect = chai.expect;

const expected = {
  service_A: {
    name: 'Service A',
    documents: {
      tos: {
        location: 'https://www.servicea.example/tos',
        contentSelector: 'body'
      }
    }
  },
  service_B: {
    name: 'Service B',
    documents: {
      tos: {
        location: 'https://www.serviceb.example/tos',
        contentSelector: 'body'
      }
    }
  }
}

describe('Loader', () => {
  describe('#loadServiceDeclarations', () => {
    it('returns an object with all service declarations', async () => {
      const result = await loadServiceDeclarations(SERVICE_DECLARATIONS_PATH);
      expect(result).to.deep.equal(expected);
    });
  });
});
