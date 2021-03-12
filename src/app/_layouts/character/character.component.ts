import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WeaponModel } from 'src/app/_models/weapon.model';
import { EnvironmentPathService } from 'src/app/_services/environment-path.service';
import { CharacterModel } from './../../_models/character.model';

@Component({
    selector: 'app-character',
    templateUrl: './character.component.html',
    styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
    @Input() character: CharacterModel;
    @Input() characterData: any[];
    @Input() weaponData: WeaponModel[];
    @Output() deleteCharacter = new EventEmitter<string>();

    characterForm: FormGroup;

    public path: string = this.url.getUrl("./../../assets/resources/characters/", true);
    public levels = [1, 20, 40, 50, 60, 70, 80, 90];
    public ascensions = [0, 1, 2, 3, 4, 5, 6, 7];
    public talents = [1, 1, 2, 4, 6, 8, 10];

    public weaponFilter: string = "";
    public filteredWeapons: any[] = [];

    constructor(
        private url: EnvironmentPathService
    ) { }

    ngOnInit() {
        this.character.file = this.path + this.character.file + ".png";
        let weaponType = this.characterData[this.character.name].weapon;
        //this.filteredWeapons = this.weaponData.filter(w => w.type == weaponType);
    }

    /**
     * Tells the parent component that the trash button was clicked
     */
    removeCharacter() {
        this.deleteCharacter.emit(this.character.name);
    }

    /**
     * Makes the character visible or invisible in the materials table
     */
    toggleCharacterDisplay() {
        this.character.display = !this.character.display;
    }

    /**
     * 
     */
    setWeapon() {

    }

    /**
     * Filters the full weapon list with the keywords typed by the user
     */
    filterWeapons() {

    }

    /**
     * Checks if ascension of character needs to be adjusted with change in level, 
     * and checks for related consequential changes 
     * @type c or t, c meaning current and t meaning target
     */
    checkAscension(type: string) {
        switch (type) {
            case "c":
                if (
                    this.character.ascension ==  null || 
                    this.character.ascension < 0 || 
                    this.character.ascension > 6
                )
                    return;

                this.syncAscToLevel();
                this.syncTlevelToLevel();
                this.syncTascToTlevel();
                this.syncTalentToAsc();
                break;
            case "t":
                if (
                    this.character.tascension == null || 
                    this.character.tascension < 0 || 
                    this.character.tascension > 6
                )
                    return;

                this.syncTascToTlevel();
                this.syncAscToTasc();
                this.syncLevelToTlevel();
                this.syncTtalentToTasc();
                break;
        }
    }

    /**
     * Checks if level of character needs to be adjusted with change in ascension, 
     * and checks for related consequential changes 
     * @type c or t, c meaning current and t meaning target
     */
    checkLevel(type: string) {
        switch (type) {
            case "c":
                if (
                    this.character.ascension == null || 
                    this.character.ascension < 0 || 
                    this.character.ascension > 6
                )
                    return;

                this.syncLevelToAsc();
                this.syncTascToAsc();
                this.syncTlevelToTasc();
                this.syncTalentToAsc();
                break;
            case "t":
                if (
                    this.character.tascension == null || 
                    this.character.tascension < 0 || 
                    this.character.tascension > 6
                )
                    return;

                this.syncTlevelToTasc();
                this.syncAscToTasc();
                this.syncLevelToAsc();
                this.syncTtalentToTasc();
                break;
        }
    }

    /**
     * Checks if talent of character needs to be adjusted with change in talent, 
     * and checks for related consequential changes 
     * @type 
     *     cba - current base attack level
     *     tba - target base attack level
     *     ces - current elemental skill level
     *     tes - target elemental skill level
     *     ceb - current elemental burst level
     *     teb - target elemental burst level
     */
    checkTalent(type: string) {
        switch (type) {
            case "cba":
                if (
                    this.character.tbalevel == null ||
                    this.character.tbalevel < 0 || 
                    this.character.tbalevel > 10
                )
                    return;

                this.syncTalentToTtalent("ba");
                this.syncTAscToTtalent();
                break;
            case "tba":
                if (
                    this.character.balevel == null || 
                    this.character.balevel < 0 || 
                    this.character.balevel > 10
                )
                    return;
                
                this.syncTtalentToTalent("ba");
                this.syncAscToTalent();
                break;
            case "ces":
                if (
                    this.character.teslevel == null || 
                    this.character.teslevel < 0 || 
                    this.character.teslevel > 10
                )
                    return;
                
                this.syncTalentToTtalent("es");
                this.syncTAscToTtalent();
                break;
            case "tes":
                if (
                    this.character.eslevel == null || 
                    this.character.eslevel < 0 || 
                    this.character.eslevel > 10
                )
                    return;

                this.syncTtalentToTalent("es");
                this.syncAscToTalent();
                break;
            case "ceb":
                if (
                    this.character.teblevel == null ||
                    this.character.teblevel < 0 ||
                    this.character.teblevel > 10
                )
                    return;

                    this.syncTalentToTtalent("eb");
                this.syncTAscToTtalent();
                break;
            case "teb":
                if (
                    this.character.eblevel == null || 
                    this.character.eblevel < 0 || 
                    this.character.eblevel > 10
                )
                    return;

                this.syncTtalentToTalent("eb");
                this.syncAscToTalent();
                break;
        }
    }

    /**
     * Methods adjusting attributes
     */

    syncAscToLevel() {
        if (
            this.character.level >= this.levels[this.character.ascension] &&
            this.character.level <= this.levels[this.character.ascension + 1]
        ) { } else {
            let previous = 0;
            for (let i = 0; i < this.levels.length; i++) {
                if (previous == 0) {
                    previous = this.levels[i];
                    continue;
                }
                if (
                    this.character.level >= previous &&
                    this.character.level <= this.levels[i]
                ) {
                    this.character.ascension = this.ascensions[i] - 1;
                    break;
                }

                previous = this.levels[i];
            }
        }
    }

    syncTlevelToLevel() {
        if (this.character.level > this.character.tlevel) {
            this.character.tlevel = this.character.level;
        }
    }

    syncLevelToTlevel() {
        if (this.character.level > this.character.tlevel) {
            this.character.level = this.character.tlevel;
        }
    }

    syncTascToTlevel() {
        if (
            this.character.tlevel >= this.levels[this.character.tascension] &&
            this.character.tlevel <= this.levels[this.character.tascension + 1]
        ) { } else {
            let previous = 0;
            for (let i = 0; i < this.levels.length; i++) {
                if (previous == 0) {
                    previous = this.levels[i];
                    continue;
                }
                if (
                    this.character.tlevel >= previous &&
                    this.character.tlevel <= this.levels[i]
                ) {
                    this.character.tascension = this.ascensions[i] - 1;
                    break;
                }

                previous = this.levels[i];
            }
        }
    }

    syncLevelToAsc() {
        if (
            this.character.level >= this.levels[this.character.ascension] &&
            this.character.level <= this.levels[this.character.ascension + 1]
        ) { } else {
            for (let i = 0; i < this.ascensions.length; i++) {
                if (this.character.ascension == this.ascensions[i]) {
                    this.character.level = this.levels[i];
                    break;
                }
            }
        }
    }

    syncTascToAsc() {
        if (this.character.ascension > this.character.tascension) {
            this.character.tascension = this.character.ascension;
            this.syncTtalentToTasc();
        }
    }

    syncTlevelToTasc() {
        if (
            this.character.tlevel >= this.levels[this.character.tascension] &&
            this.character.tlevel <= this.levels[this.character.tascension + 1]
        ) { } else {
            for (let i = 0; i < this.ascensions.length; i++) {
                if (this.character.tascension == this.ascensions[i]) {
                    this.character.tlevel = this.levels[i+1];
                    break;
                }
            }
        }
    }

    syncAscToTasc() {
        if (this.character.ascension > this.character.tascension) {
            this.character.ascension = this.character.tascension;
        }
    }

    syncTtalentToTasc() {
        if (
            this.character.tbalevel >= this.talents[this.character.tascension] &&
            this.character.tbalevel <= this.talents[this.character.tascension - 1]
        ) { } else {
            for (let i = 0; i < this.ascensions.length; i++) {
                if (this.character.tascension == this.ascensions[i]) {
                    this.character.tbalevel = this.talents[i];
                    this.syncTalentToTtalent("ba");
                    break;
                }
            }
        }
        if (
            this.character.teslevel >= this.talents[this.character.tascension] &&
            this.character.teslevel <= this.talents[this.character.tascension - 1]
        ) { } else {
            for (let i = 0; i < this.ascensions.length; i++) {
                if (this.character.tascension == this.ascensions[i]) {
                    this.character.teslevel = this.talents[i];
                    this.syncTalentToTtalent("es");
                    break;
                }
            }
        }
        if (
            this.character.teblevel >= this.talents[this.character.tascension] &&
            this.character.teblevel <= this.talents[this.character.tascension - 1]
        ) { } else {
            for (let i = 0; i < this.ascensions.length; i++) {
                if (this.character.tascension == this.ascensions[i]) {
                    this.character.teblevel = this.talents[i];
                    this.syncTalentToTtalent("eb");
                    break;
                }
            }
        }
    }

    syncTalentToAsc() {
        if (this.character.balevel >= this.talents[this.character.ascension])
            this.character.balevel = this.talents[this.character.ascension];
        
        if (this.character.eslevel >= this.talents[this.character.ascension])
            this.character.eslevel = this.talents[this.character.ascension];
        
        if (this.character.eblevel >= this.talents[this.character.ascension])
            this.character.eblevel = this.talents[this.character.ascension];
    }

    syncTtalentToTalent(type: string) {
        switch (type) {
            case "ba":
                if (this.character.balevel > this.character.tbalevel)
                    this.character.tbalevel = this.character.balevel;
                break;
            case "es":
                if (this.character.eslevel > this.character.teslevel)
                    this.character.teslevel = this.character.eslevel;
                break;
            case "eb":
                if (this.character.eblevel > this.character.teblevel)
                    this.character.teblevel = this.character.eblevel;
                break;
        }
    }

    syncAscToTalent() {
        let highestTalent = Math.max(
            this.character.balevel, this.character.eslevel, this.character.eblevel
        );

        if (this.talents[this.character.ascension] < highestTalent) {
            let previous = 0;
            for (let i = 0; i < this.talents.length; i++) {
                if (previous == 0) {
                    previous = this.talents[i];
                    continue;
                }
                if (
                    highestTalent >= previous &&
                    highestTalent <= this.talents[i]
                ) {
                    this.character.ascension = this.ascensions[i];
                    break;
                }

                previous = this.talents[i];
            }
            this.syncLevelToAsc();
            this.syncTascToAsc();
        }
    }

    syncTalentToTtalent(type: string) {
        switch (type) {
            case "ba":
                if (this.character.balevel > this.character.tbalevel)
                    this.character.balevel = this.character.tbalevel;
                break;
            case "es":
                if (this.character.eslevel > this.character.teslevel)
                    this.character.eslevel = this.character.teslevel;
                break;
            case "eb":
                if (this.character.eblevel > this.character.teblevel)
                    this.character.eblevel = this.character.teblevel;
                break;
        }
    }

    syncTAscToTtalent() {
        let highestTalent = Math.max(
            this.character.tbalevel, this.character.teslevel, this.character.teblevel
        );

        if (this.talents[this.character.tascension] < highestTalent) {
            let previous = 0;
            for (let i = 0; i < this.talents.length; i++) {
                if (previous == 0) {
                    previous = this.talents[i];
                    continue;
                }
                if (
                    highestTalent >= previous &&
                    highestTalent <= this.talents[i]
                ) {
                    this.character.tascension = this.ascensions[i] - 1;
                    break;
                }

                previous = this.talents[i];
            }
            this.syncTlevelToTasc();
            this.syncAscToTasc();
            this.syncLevelToAsc();
        }
    }
}

