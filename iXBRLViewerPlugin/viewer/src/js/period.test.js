// Copyright 2019 Workiva Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import moment from 'moment';
import { Period } from "./period.js";
import "./moment-jest.js";

describe("Duration vs instant", () => {
    test("Durations", () => {
        var d = new Period("2018-01-01/2019-01-01"); 
        expect(d.from()).toEqualDate(moment.utc("2018-01-01"));
        expect(d.to()).toEqualDate(moment.utc("2019-01-01"));
        expect(d.toString()).toEqual("1 Jan 2018 to 31 Dec 2018");
    });
    test("Instant without time", () => {
        var i = new Period("2019-01-01"); 
        expect(i.from()).toBeNull();
        expect(i.to()).toEqualDate(moment.utc("2019-01-01"));
        expect(i.toString()).toEqual("31 Dec 2018");
    });

    test("Instant with time", () => {
        var i = new Period("2019-01-01T06:00:00"); 
        expect(i.from()).toBeNull();
        expect(i.to()).toEqualDate(moment.utc("2019-01-01T06:00:00"));
        expect(i.toString()).toEqual("1 Jan 2019 06:00:00");
    });
});

describe("Period.toString", () => {
    test("Instant with no time part", () => {
        var d = new Period("2018-06-02");
        expect(d.toString()).toEqual("1 Jun 2018");
    });
    test("Instant with explicit zero time part", () => {
        var d = new Period("2018-06-02T00:00:00");
        expect(d.toString()).toEqual("1 Jun 2018");
    });
    test("Instant with non-zero time part", () => {
        var d = new Period("2018-06-01T03:00:00");
        expect(d.toString()).toEqual("1 Jun 2018 03:00:00");
    });
    test("Duration with no time part", () => {
        var d = new Period("2017-06-02/2018-06-02");
        expect(d.toString()).toEqual("2 Jun 2017 to 1 Jun 2018");
    });
    test("Instant with explicit zero time part", () => {
        var d = new Period("2017-06-02T00:00:00/2018-06-02T00:00:00");
        expect(d.toString()).toEqual("2 Jun 2017 to 1 Jun 2018");
    });
    test("Instant with non-zero time part", () => {
        var d = new Period("2017-06-02T07:00:00/2018-06-01T03:00:00");
        expect(d.toString()).toEqual("2 Jun 2017 07:00:00 to 1 Jun 2018 03:00:00");
    });
});

describe("Equivalent durations", () => {
    test("Instant vs duration", () => {
        var i = new Period("2019-01-01"); 
        var d = new Period("2018-01-01/2019-01-01"); 
        expect(i.isEquivalentDuration(d)).toBeFalsy();
        expect(d.isEquivalentDuration(i)).toBeFalsy();
    });

    test("Two instants", () => {
        var i1 = new Period("2019-01-01"); 
        var i2 = new Period("2018-01-01"); 
        expect(i1.isEquivalentDuration(i2)).toBeTruthy();
    });

    test("Exact same duration", () => {
        var d1 = new Period("2018-01-01/2019-01-01"); 
        var d2 = new Period("2018-01-01/2019-01-01"); 
        expect(d1.isEquivalentDuration(d2)).toBeTruthy();
    });

    test("Two years, one leap", () => {
        var d1 = new Period("2016-01-01/2017-01-01"); 
        var d2 = new Period("2017-01-01/2018-01-01"); 
        expect(d1.isEquivalentDuration(d2)).toBeTruthy();
    });

    test("Two months", () => {
        // We allow 20% variance, so this is OK.
        var d1 = new Period("2017-01-01/2017-02-01"); 
        var d2 = new Period("2017-02-01/2017-03-01"); 
        expect(d1.isEquivalentDuration(d2)).toBeTruthy();
    });

    test("One month vs two months", () => {
        // We allow 20% variance, so this is OK.
        var d1 = new Period("2017-01-01/2017-02-01"); 
        var d2 = new Period("2017-02-01/2017-04-01"); 
        expect(d1.isEquivalentDuration(d2)).toBeFalsy();
    });

});
