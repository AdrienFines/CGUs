import fs from 'fs';
import chai from 'chai';

import { RAW_DIRECTORY, save, commit, persist } from './persistor.js';

const expect = chai.expect;

const SERVICE_PROVIDER_ID = 'test_service_provider';
const POLICY_TYPE = 'terms_of_service';
const FILE_CONTENT = 'ToS fixture data with UTF-8 çhãràčtęrs';
const EXPECTED_FILE_PATH = `${RAW_DIRECTORY}/${SERVICE_PROVIDER_ID}/${POLICY_TYPE}.html`;


describe('History', () => {
  describe('#save', () => {
    context('when service provider’s directory already exist', () => {
      after(() => {
        fs.unlinkSync(EXPECTED_FILE_PATH);
      });

      it('creates a file for the given service provider', async () => {
        await save({
          serviceProviderId: SERVICE_PROVIDER_ID,
          policyType: POLICY_TYPE,
          fileContent: FILE_CONTENT,
          isSanitized: false
        });

        expect(fs.readFileSync(EXPECTED_FILE_PATH, { encoding: 'utf8' })).to.equal(FILE_CONTENT);
      });
    });

    context('when service provider’s directory does not already exist', () => {
      const NEW_SERVICE_PROVIDER_ID = 'test_not_existing_service_provider';
      const NEW_SERVICE_PROVIDER_EXPECTED_FILE_PATH = `${RAW_DIRECTORY}/${NEW_SERVICE_PROVIDER_ID}/${POLICY_TYPE}.html`;

      after(() => {
        fs.unlinkSync(NEW_SERVICE_PROVIDER_EXPECTED_FILE_PATH);
      });

      it('creates a directory and file for the given service provider', async () => {
        await save({
          serviceProviderId: NEW_SERVICE_PROVIDER_ID,
          policyType: POLICY_TYPE,
          fileContent: FILE_CONTENT,
          isSanitized: false
        });

        expect(fs.readFileSync(NEW_SERVICE_PROVIDER_EXPECTED_FILE_PATH, { encoding: 'utf8' })).to.equal(FILE_CONTENT);
      });
    });
  });

  describe('#commit', () => {
    before(async () => {
      return save({
        serviceProviderId: SERVICE_PROVIDER_ID,
        policyType: POLICY_TYPE,
        fileContent: FILE_CONTENT,
        isSanitized: false
      });
    });

    after(() => {
      fs.unlinkSync(EXPECTED_FILE_PATH);
    });

    it('commits the file for the given service provider', async () => {
      const sha = await commit({
        serviceProviderId: SERVICE_PROVIDER_ID,
        policyType: POLICY_TYPE,
        isSanitized: false
      });
      expect(sha).to.not.be.null;
    });
  });

  describe('#persist', () => {
    let sha;
    before(async () => {
      sha = await persist({
        serviceProviderId: SERVICE_PROVIDER_ID,
        policyType: POLICY_TYPE,
        fileContent: FILE_CONTENT,
        isSanitized: false
      });
    });

    after(() => {
      fs.unlinkSync(EXPECTED_FILE_PATH);
    });

    it('creates a file for the given service provider', () => {
      expect(fs.readFileSync(EXPECTED_FILE_PATH, { encoding: 'utf8' })).to.equal(FILE_CONTENT);
    });

    it('commits the file for the given service provider', () => {
      expect(sha).to.exist;
      expect(sha).to.be.a('string');
    });
  });
});