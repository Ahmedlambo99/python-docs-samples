// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {List} from 'immutable';
import {spawnSync} from 'child_process';

export type Diff = {
  filename: string;
  lineNumbers: number[];
};

export function branchName(): string {
  const p = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  return p.stdout.toString().trim();
}

export function diffs(commit1: string, commit2: string): List<Diff> {
  const p = spawnSync('git', ['diff', '--unified=0', commit1, commit2]);
  return List(p.stdout.toString().split(/^diff --git a\//m))
    .map(output => output.split('\n').filter(line => line.length > 0))
    .filter(lines => lines.length > 0)
    .map(lines => ({
      filename: lines[0].split(' ')[0],
      lineNumbers: lines
        .map(line => line.match(/^@@ -(\d+)/)?.at(1))
        .filter(match => match !== undefined)
        .map(match => parseInt(match)),
    }));
}

export function root(): string {
  const p = spawnSync('git', ['rev-parse', '--show-toplevel']);
  return p.stdout.toString().trim();
}