// src/components/Modals/ConsentFormModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConsentFormModalProps {
  open: boolean;
  onAgree: () => void;
}

export function ConsentFormModal({ open, onAgree }: ConsentFormModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>{t('këyitu nangu')}</DialogTitle>
      <DialogContent dividers style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <p>
          JÀMM AK JÀMM,<br />
          Jëfandikukat bi,<br /><br />

          Jàngat bi mooy benn xibaar bu am solo ngir la xam li ñuy def ci jàppale bii.
          Bu la neex, jàng ko ba mu mat, ndaxte daf lay jox sañ-sañu xam li ñuy def,
          jafe-jafe yi mën a am, ak sa yitte ci jàppale bi. Soo amee laaj,
          mën nga laaj ko kenn ci liggéeykat yi.<br /><br />

          <b>Liggéey bi:</b><br />
          Jàppale bii mooy jàngat bu jëm ci jëfandikukat earbuds ngir jàngale
          mbër ak tàggat biir ndox mu noppal ci jëfandikukat bi ci kaw.
          Ñuy seet ni signaal yu mbër yi di dox ci jëfandikukat earbuds
          mën nañu jëfandikoo ngir xam xaalis biir yaram ak jàmm.<br /><br />

          <b>Bokk ak jëfandikoo:</b><br />
          ● Nga war a am 18 at walla lu ëpp.<br />
          ● Nga war a jëfandikoo earbuds yi ak jëfandikukat bi ci kaw
          (ni Digital Stethoscope, Blood Pressure Cuff walla ECG Chest Strap)
          ci diggante 15 ak 30 minit.<br />
          ● Nga war a tontu benn questionnaire bu jëm ci sa jàmm ak sa yitte
          ci jëfandikoo earbuds yi.<br /><br />

          <b>Jafe-jafe walla discomfort:</b><br />
          ● Mën na am yit walla xalaat yu neexul ci jëfandikoo earbuds yi
          walla jëfandikukat yi ci kaw.<br />
          ● Am na yeneen jafe-jafe yu jëm ci privacy ak aar xibaar
          yu jëm ci signaal yu yaram.<br /><br />

          Yeneen xam-xam yu am solo:<br />
          ● Nga mën a bayyi jàppale bi ci jamono bu nekk te kenn du la
          wut dara ci ko.<br />
          ● Sa xibaar yu jëm ci sa jàmm ak sa tur dinañu leen aar bu baax.<br /><br />

          <b>Aar xibaar (Confidentialité):</b><br />
          ● Xibaar yi ñuy dajale dinañu leen aar te kenn du leen jëfandikoo
          ngir xam sa tur.<br />
          ● Resulta yi mën nañu feeñ ci bind walla ci wone,
          waaye duñu feeñ sa tur walla xam-xam bu la jëm.<br />
          ● Xibaar yi dinañu leen aar te jëfandikoo leen rekk ngir liggéey bii.<br /><br />

          <b>Bokk bu sañ-sañ am:</b><br />
          ● Sa bokk ci jàppale bii mooy bu sa yitte la.<br />
          ● Nga mën a bayyi jàppale bi ci jamono bu nekk.<br />
          ● Bayyi jàppale bi du la lor walla tegg sa yoon ci benn jëfandikoo
          walla jëfandikoo yu la war a jot.<br /><br />

          <b>Bindu sañ-sañ (Consent Statement):</b><br />
          Bu nga bësée ci butoŋ bi ne “Agree”, dafay tekki ni
          nga jàng na, nga xam na, te nga nangu bokk ci jàppale bii
          ci sa yitte bu mat.<br /><br />

          <b>Bindu liggéeykat bi:</b><br />
          Man, Dr. Shangguan Longfei, maa ngi seede ne liggéey bii,
          anam yi ñuy def, jafe-jafe yi mën a am,
          ak sañ-sañ yu participant bi, ñépp ñu leen leeral nañu.
          Dinaa def liggéey bi ci jamono ju baax,
          te dinaa aar xibaar ak jikko yu jëm ci ethics.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAgree} variant="contained">
          {t('ànd')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
