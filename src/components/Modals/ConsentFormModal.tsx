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
      <DialogTitle>{t('consent_form')}</DialogTitle>
      <DialogContent dividers style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <p>
          JÀMM AK JÀMM,<br />
          Jëfandikukat bi,<br /><br />

          Bu nu ngi jàppale ci «Noppalal Mbër mi ak Tàggat Biir Ndox mu Noppal ci Kanëp bi ak Jëfandikukat Earbuds». Ndaxte nga war a gis lu mujj ci mbirum jàppale bi, defal ci sa wér, te xam lu mujj ci xam-xam bi, lu nekk ci jàppale bi, ak sa laaj bi nga am ci sa wér.<br /><br />

          <b>Liggéey bi:</b><br />
          Bokk bi mooy sàkku jàppale ci jamono jëm ci jëfandikukat earbuds ngir jàngale mbër ak tàggat biir ndox mu noppal ci kanëp bi. Liggéey bi gis na ni signaalu mbër yi mën a xamale ci jëfandikukat earbuds.<br /><br />

          <b>Bokk ak jàppale:</b><br />
          ● Nga am 18 at ak ñaari at ak mëneef jàppale.<br />
          ● Nga am yoon ngir jëfandikukat earbuds yi ak jëfandikukat bi ci kanëp bi (Digital Stethoscope, Blood Pressure Cuff, walla ECG Chest Strap) ci 15-30 minit, dina am ci wàllu.<br />
          ● Nga defal benn questionnaire ci ni nga am jàmm ngir jëfandikukat earbuds ngir jàngale mbër.<br /><br />

          <b>Jafe-jafe ak discomfort:</b><br />
          ● Ñu mën a am jafe-jafe ci jëfandikukat earbuds walla jëfandikukat bi ci kanëp.<br />
          ● Jàppale bi mën a am ci privacy ak xam-xam yi am ci physiological signals.<br /><br />

          Ngi ci yeneen:<br />
          ● Nga mën a jàppale bu nu ngi am jafe-jafe ci jamono bi.<br />
          ● Sa xibaar yi dinañu am ci jàmm ak sa tur dinañu yàggal.<br /><br />

          <b>Confidentialité:</b><br />
          ● Sa xibaar yu bees mën a am solo, dinañu am ci xibaar yu juróom ñaar.<br />
          ● Resulta yi dinañu am ci jàmm, te kenn dina xam sa tur ci publications walla reports.<br />
          ● Bokk bi am ci xibaar yi dinañu am ci jàmm te dinañu defar.<br /><br />

          <b>Bokk bu bees ak defal jàppale:</b><br />
          ● Bokk bi mooy bu bees te sa wér.<br />
          ● Nga am tënku ci di jàppale walla wut sa xibaar ci jamono bi nga bëgg.<br />
          ● Jàppale bu bees du may a defar sa njàngale walla services yi nga am.<br /><br />

          <b>Consent Statement:</b><br />
          Bu nga dugg ci "Agree", maa ngi xam ni maa gis, xam, te jàppale ak yeneen bopp yi ci consent form bi.<br /><br />

          <b>Investigator Certification:</b><br />
          Maa ngi Dr. 上官龙飞, maa ngi taxawal liggéey bi, procedures yi, jafe-jafe yi, ak beneefu bi ci participant bi. Maa ngi jàppale ci ethics ak confidentiality.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAgree} variant="contained">
          {t('agree')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
