/*jshint esversion: 6 */
import Landing from './components/landing/Landing.vue';

import Editor from './components/editor/Editor.vue';

import Docs from './components/docs/Docs.vue';
import IntroDocs from './components/docs/pages/Introduction.md';
import EditorDocs from './components/docs/pages/Editor.md';
import ApiDocs from './components/docs/pages/Api.md'


export const routes = [
    { path: '/home', component: Landing},
    { path: '', component: Editor },
    { path: '/editor/example', component: Editor},
    { path: '/docs', component: Docs, children: [
        { path: '', component: IntroDocs },
        { path: 'editor', component: EditorDocs },
        { path: 'api', component: ApiDocs }
    ]}

];
